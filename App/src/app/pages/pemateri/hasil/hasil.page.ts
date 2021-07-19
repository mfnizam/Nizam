import { Component, OnDestroy } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../services/server/server.service';
import { StorageService } from '../../../services/storage/storage.service';
import { ModalService } from '../../../services/modal/modal.service';
import { UserService } from '../../../services/user/user.service';
import { PelatihanService, Pelatihan, Pelajaran } from '../../../services/pelatihan/pelatihan.service';

@Component({
  selector: 'app-hasil',
  templateUrl: './hasil.page.html',
  styleUrls: ['./hasil.page.scss'],
})
export class HasilPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

  dataPelatihanAktif: Pelatihan;
  dataPelajaran: Pelajaran[] = [];
  loadingPelajaran = 0;

  jenis = 'semua';
  status = 'semua';


  constructor(
    private server: ServerService,
    private storage: StorageService,
    private modal: ModalService,
    private pelatihan: PelatihanService,
    private user: UserService,
    ) {

    pelatihan.getDataPelatihanAktif()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPelatihanAktif = data;
      this.dataPelajaran = [];
      if(data) this.ambilPelajaran(data._id)
    })

    pelatihan.getDataPelajaran()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPelajaran = JSON.parse(JSON.stringify(data));;
      this.dataPelajaran.forEach(v => {
        v.materi = v.materi.filter(v => v.jenis < 4).map(m => {
          if(m.peserta){
            let nilai = m.peserta.map(v => v.penilaian).filter(v => Number.isFinite(v))
            m.tertinggi = (Math.max(0, ...nilai) * 100) / m.soal.length;
            m.rata = (nilai.reduce((a, c) => a + c, 0) * 100) / m.soal?.length / m.mengerjakan;
          }
          return m;
        })
        return v;
      })
    }) 
  }

  ionViewDidEnter(){
    if(this.dataPelatihanAktif) this.ambilPelajaran(this.dataPelatihanAktif._id);
    
    if(!this.pelatihan.getValuePelatihanAktif()){
      this.storage.getDecodedStorage('user:data').then((data: any)=> {
        if(data._id) this.ambilPelatihan(data._id)   
      })
    }
  }

  ambilPelatihan(id){
    if(this.pelatihan.getValuePelatihan().length < 1){
      this.modal.showLoading("Memuat data pelatihan...");
    }
    this.server.pelatihan(id).then(data => {
      this.modal.hideLoading();
      console.log(data)
      if(data.success) {
        // this.pelatihan.setDataPelatihan(data.pelatihan)
        this.pelatihan.setDataPelatihanAktif(data.pelatihan[0])
        this.storage.setStorage('user:pelatihan', data.pelatihan[0])
      }
    }).catch(err => {
      this.modal.hideLoading();
      console.log(err)
    })
  }

  ambilPelajaran(idPelatihan, idUser = this.user.getValueUser()?._id){
    if(!idPelatihan || !idUser) return;
    this.loadingPelajaran = 1;
    this.server.hasilPelajaran({idPelatihan, idUser}).then(data => {
      console.log(data)
      if(data.success){
        this.loadingPelajaran = 0;
        this.pelatihan.setDataPelajaran(data.pelajaran);
      }else{
        this.loadingPelajaran = 2;
      }
    }).catch(err => {
      this.loadingPelajaran = 2;
      console.log(err)
    })
  }

  ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
  }

  get jenisMateri(){
    return this.pelatihan.jenisMateri;
  }
}
