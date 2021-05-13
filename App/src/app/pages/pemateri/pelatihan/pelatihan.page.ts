import { Component, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../services/server/server.service';
import { StorageService } from '../../../services/storage/storage.service';
import { ModalService } from '../../../services/modal/modal.service';
import { PelatihanService, Pelatihan } from '../../../services/pelatihan/pelatihan.service';


@Component({
  selector: 'app-pelatihan',
  templateUrl: './pelatihan.page.html',
  styleUrls: ['./pelatihan.page.scss'],
})
export class PelatihanPage implements OnDestroy {
	private destroy$: Subject<void> = new Subject<void>();
	dataPelatihan: Pelatihan[] = [];
  dataPelatihanAktif: Pelatihan;

  constructor(
    private navCtrl: NavController,
  	private server: ServerService,
    private storage: StorageService,
    private modal: ModalService,
  	private pelatihan: PelatihanService,
  	) {
  	pelatihan.getDataPelatihan()
  	.pipe(takeUntil(this.destroy$))
  	.subscribe(data => {
  		this.dataPelatihan = data;
      if(this.dataPelatihanAktif) this.pilih(this.dataPelatihanAktif._id);
  	})

    pelatihan.getDataPelatihanAktif()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      console.log(data, 'getDataPelatihanAktif')
      this.dataPelatihanAktif = data;
      if(data) this.pilih(data._id);
    })

    if(!pelatihan.getValuePelatihanAktif()){
      this.storage.getStorage('user:pelatihan').then(data => {
        this.pelatihan.setDataPelatihanAktif(data);
      })
    }
  }

  ionViewDidEnter(){
    this.storage.getDecodedStorage('user:data').then((data: any)=> {
      this.ambilPelatihan(data._id)   
    })
  }

  ambilPelatihan(id){
    if(this.pelatihan.getValuePelatihan().length < 1){
      this.modal.showLoading("Memuat data pelatihan...");
    }
    this.server.pelatihan(id).then(data => {
      this.modal.hideLoading();
      console.log(data)
      if(data.success) this.pelatihan.setDataPelatihan(data.pelatihan)
    }).catch(err => {
      this.modal.hideLoading();
      console.log(err)
    })
  }

  pilih(id){
  	this.dataPelatihan.forEach(v => {
  		v['select'] = false;
  	})
    let i = this.dataPelatihan.findIndex(v => v._id == id);
    if(i < 0) return;
  	this.dataPelatihan[i]['select'] = true;
    this.dataPelatihanAktif = this.dataPelatihan[i]; 
  }

	ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
	}

  goBack(){
    this.navCtrl.back();
  }

  simpan(){
    this.pelatihan.setDataPelatihanAktif(this.dataPelatihanAktif);
    this.storage.setStorage('user:pelatihan', this.dataPelatihanAktif)
    this.goBack();
  }
}
