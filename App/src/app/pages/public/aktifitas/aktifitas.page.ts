import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../services/server/server.service';
import { StorageService } from '../../../services/storage/storage.service';
import { ModalService } from '../../../services/modal/modal.service';
import { UserService, User } from '../../../services/user/user.service';
import { PelatihanService, Pelatihan, Pelajaran } from '../../../services/pelatihan/pelatihan.service';

@Component({
	selector: 'app-aktifitas',
	templateUrl: 'aktifitas.page.html'
})
export class AktifitasPage implements OnDestroy{
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
		private user: UserService,
		private pelatihan: PelatihanService
		) {
		pelatihan.getDataPelatihanAktif()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.dataPelatihanAktif = data;
			if(data) this.ambilPelajaran(data._id)
		})

		pelatihan.getDataPelajaran()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.dataPelajaran = data;
		})
	}

	ionViewDidEnter(){
		if(this.dataPelatihanAktif) this.ambilPelajaran(this.dataPelatihanAktif._id);
		
		if(!this.pelatihan.getValuePelatihanAktif()){
			this.storage.getDecodedStorage('user:data').then((data: any)=> {
				this.ambilPelatihan(data._id)   
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
		this.server.pengacakanPelajaran({idPelatihan, idUser}).then(data => {
			console.log(data)
			if(data.success){
				this.loadingPelajaran = 0;
				if(this.pelatihan.getValuePilihan().length > 0){
					console.log('pilihan ada')
					data.pelajaran.forEach(p => {
						p.materi.forEach(m => {
							m.soal.map(s => {
								let pi = this.pelatihan.getValuePilihan().find(v => v.materi == m._id)?.pilihan.find(v => v.soal == s._id);
								if(pi) s['pilihan'] = pi.pilihan
								return s;
							})
						})
						return p;
					})
				}
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
