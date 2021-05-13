import { Component, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PelatihanService, Pelatihan } from '../../../../services/pelatihan/pelatihan.service';
import { MasterService } from '../../../../services/master/master.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ServerService } from '../../../../services/server/server.service';
import { User } from '../../../../services/user/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();
  idPelatihan: string;
  dataPelatihan: Pelatihan;
  dataPemateri: User[];
  dataPeserta: User[];

  penerimaBelumLunas: User[] = [];
  penerimaLunas: User[] = [];

  penerimaBelumLoading = 0;
  penerimaLunasLoading = 0;

  constructor(
  	private navCtrl: NavController,
    private active: ActivatedRoute,
    private pelatihan: PelatihanService,
    private master: MasterService,
    private modal: ModalService,
    private server: ServerService
    ) {
  	active.params
  	.pipe(takeUntil(this.destroy$))
  	.subscribe(data => {
      this.idPelatihan = data.id;
      this.dataPelatihan = this.pelatihan.getValuePelatihan().find(v => v._id == data.id);
    })

    this.pelatihan.getDataPelatihan()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPelatihan = data.find(v => v._id == this.idPelatihan);
    })

    this.master.getDataPemateri()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPemateri = data;
    })

    this.master.getDataPeserta()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPeserta = data;
    })    
  }

  ionViewDidEnter(){
    if(this.pelatihan.getValuePelatihan().length < 1){
      this.server.ambilPelatihan().then(data => {
        if(data.success){
          this.pelatihan.setDataPelatihan(data.pelatihan);
          // this.dataPelatihan = data.pelatihan.find(v => v._id == this.idPelatihan);
        }
      })
    }

    if(this.master.getValuePeserta().length < 1 || this.master.getValuePemateri().length < 1){
      this.modal.showLoading('Memuat Data...');
      let pes = this.server.ambilPeserta().catch(error => { return new Error(error) });
      let pem = this.server.ambilPemateri().catch(error => { return new Error(error) });
      Promise.all([pes, pem]).then(data => {
        setTimeout(_ => { this.modal.hideLoading() }, 2000)
        console.log(data);
        if(data[0].success) this.master.setDataPeserta(data[0].peserta);
        if(data[1].success) this.master.setDataPemateri(data[1].pemateri);
      })
    }
  }
  
  ngOnDestroy(){
  	this.destroy$.next();
  	this.destroy$.complete();
  }

  goBack(){
    this.navCtrl.back();
  }

  hapus(){
  	this.modal.showConfirm('Hapus Pelatihan', 'Apakan anda ingin menghapus pelatihan <b class="ion-text-capitalize">' + this.dataPelatihan.nama + '</b>', ['Batal', 'Hapus']).then(data => {
      if(data){
        this.modal.showLoading('Menghapus Data Pelatihan');
        this.server.hapusPelatihan(this.dataPelatihan._id).then(data => {
          console.log(data)
          this.modal.hideLoading();
          if(data.success){     
            this.pelatihan.setDataPelatihan(this.pelatihan.getValuePelatihan().filter(v => v._id != data.pelatihan._id));
            this.modal.showToast('Berhasil Menghapus Pelatihan', {color: 'success', aboveTab: true})
            setTimeout(_ => {
              this.goBack();
            }, 500)
          }else{
            this.modal.showToast('Gagal Menghapus Pelatihan', {color: 'danger', aboveTab: true})
          }
        }).catch(err => {
          console.log(err)
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menghapus Pelatihan', {color: 'danger', aboveTab: true})
        })
      }
    })
  }

  tambahPemateri(){
    this.modal.showModal({
      jenis: 'select',
      header: 'Pilih Pemateri',
      data: this.dataPemateri.map((v: any) => { 
        return { id: v._id, title: v.namaLengkap, subTitle: '<small>' + (v.noTlp || '-') + '</small>', checked: this.dataPelatihan.pemateri.map(v => v._id).includes(v._id) }
      }),
      button: [{ 
        title: 'Batal', 
        role: 'batal'
      }, {
        title: 'Simpan', 
        submit: true/* role pada submit selalu 'ok'*/
      }]
    }).then(data => {
      if(data.role == 'ok' && data.data){
        // this.dataPelatihan.pemateri = this.dataPemateri.filter(v => data.data[v._id]);
        this.modal.showLoading('Menyimpan data pemateri...', false);
        this.server.editPemateriPelatihan({_id: this.dataPelatihan._id, pemateri: this.dataPemateri.filter(v => data.data[v._id])}).then(data => {
          console.log(data);
          setTimeout(_ => {
            this.modal.hideLoading();
          }, 500) 
          if(data.success){
            this.modal.showToast('Berhasil Menyimpan..', {color: 'success'})
            this.pelatihan.setDataPelatihan(this.pelatihan.getValuePelatihan().map(v => v._id == data.pelatihan._id? data.pelatihan : v));
          }else{
            this.modal.showToast('Berhasil Menyimpan..', {color: 'danger'})
          }
        }).catch(err => {
          console.log(err)
          this.modal.hideLoading();
          this.modal.showToast('Berhasil Menyimpan..', {color: 'danger'})
        })
      }
    })
  }

  tambahPeserta(){
    this.modal.showModal({
      jenis: 'select',
      header: 'Pilih Peserta',
      data: this.dataPeserta.map((v: any) => { 
        return { id: v._id, title: v.namaLengkap, subTitle: '<small>' + (v.noKta || '-') + '</small>', checked: this.dataPelatihan.peserta?.map(v => v._id).includes(v._id) }
      }),
      button: [{ 
        title: 'Batal', 
        role: 'batal'
      }, {
        title: 'Simpan', 
        submit: true/* role pada submit selalu 'ok'*/
      }]
    }).then(data => {
      if(data.role == 'ok' && data.data){
        // this.dataPelatihan.peserta = this.dataPeserta.filter(v => data.data[v._id]);
        this.modal.showLoading('Menyimpan data peserta...', false);
        this.server.editPesertaPelatihan({_id: this.dataPelatihan._id, peserta: this.dataPeserta.filter(v => data.data[v._id])}).then(data => {
          console.log(data);
          setTimeout(_ => {
            this.modal.hideLoading();
          }, 500) 
          if(data.success){
            this.modal.showToast('Berhasil Menyimpan..', {color: 'success'})
            this.pelatihan.setDataPelatihan(this.pelatihan.getValuePelatihan().map(v => v._id == data.pelatihan._id? data.pelatihan : v));
          }else{
            this.modal.showToast('Berhasil Menyimpan..', {color: 'danger'})
          }
        }).catch(err => {
          console.log(err)
          this.modal.hideLoading();
          this.modal.showToast('Berhasil Menyimpan..', {color: 'danger'})
        })
      }
    })
  }
}
