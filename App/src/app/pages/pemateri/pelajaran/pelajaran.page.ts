import { Component, OnDestroy, ViewChild } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../services/server/server.service';
import { StorageService } from '../../../services/storage/storage.service';
import { ModalService } from '../../../services/modal/modal.service';
import { UserService } from '../../../services/user/user.service';
import { PelatihanService, Pelatihan, Pelajaran } from '../../../services/pelatihan/pelatihan.service';

@Component({
	selector: 'app-pelajaran',
	templateUrl: 'pelajaran.page.html',
	styleUrls: ['pelajaran.page.scss']
})
export class PelajaranPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

	dataPelatihanAktif: Pelatihan = null;
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
			if(data) this.ambilPelajaran(data._id);
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

  cuPelajaran(v?){
  	if(!this.dataPelatihanAktif._id || !this.user.getValueUser()._id) return;
  	this.modal.showPrompt((v? 'Edit' : 'Tambah') + ' Pelajaran', null, [{
  		name: 'nama',
  		type: 'text',
  		value: v? v.nama : null,
  		placeholder: 'Isikan nama pelajaran'
  	}]).then(data => {
  		if(data && data.role == 'ok' && data.data && data.data.values){
  			this.modal.showLoading((v? 'Edit' : 'Menambahkan') + ' Data Pelajaran...');
  			if(v){
  				this.server.editPelajaran({nama: data.data.values.nama, _id: v._id}).then(data => {
	  				this.modal.hideLoading();
	  				console.log(data)
	  				if(data.success){
	  					this.modal.showToast('Berhasil Menambahkan Pelajaran', {color: 'success', aboveTab: true});
	  					this.pelatihan.setDataPelajaran(this.pelatihan.getValuePelajaran().map(e => e._id == data.pelajaran._id? data.pelajaran : e));
	  				}else{
	  					this.modal.showToast('Gagal Menambahkan Pelajaran', {color: 'danger', aboveTab: true})
	  				}
  				}).catch(err => {
  					this.modal.hideLoading();
  					this.modal.showToast('Gagal Menambahkan Pelajaran', {color: 'danger', aboveTab: true})
  					console.log(err)
  				})
  			}else{
	  			this.server.tambahPelajaran({nama: data.data.values.nama, idPelatihan: this.dataPelatihanAktif._id, idUser: this.user.getValueUser()._id}).then(data => {
	  				this.modal.hideLoading();
	  				console.log(data)
	  				if(data.success){
	  					this.modal.showToast('Berhasil Edit Pelajaran', {color: 'success', aboveTab: true});
	  					this.pelatihan.setDataPelajaran([...this.pelatihan.getValuePelajaran(), data.pelajaran]);
	  				}else{
	  					this.modal.showToast('Gagal Edit Pelajaran', {color: 'danger', aboveTab: true})
	  				}
	  			}).catch(err => {
	  				this.modal.hideLoading();
	  				this.modal.showToast('Gagal Edit Pelajaran', {color: 'danger', aboveTab: true})
	  				console.log(err)
	  			})
  			}
  		}
  	})
  }

  hapusPelajaran(nama, id){
  	if(!id) return;
  	this.modal.showConfirm('Hapus Pelajaran', 'Ingin Menghapus Pelajaran <b class="ion-text-capitalize">"' + nama + '"</b>', ['Batal', 'Hapus']).then(data => {
  		console.log(data);
  		if(data){
		  	this.modal.showLoading('Menghapus Pelajaran...')
		  	this.server.hapusPelajaran(id).then(data => {
		  		this.modal.hideLoading();
		  		console.log(data)
		  		if(data.success){
		  			this.modal.showToast('Berhasil Menambahkan Pelajaran', {color: 'success'});
		  			this.pelatihan.setDataPelajaran(this.pelatihan.getValuePelajaran().filter(v => v._id != id))
		  		}else{
		  			this.modal.showToast('Gagal Menambahkan Pelajaran', {color: 'danger'});
		  		}
		  	}).catch(err => {
		  		this.modal.showToast('Gagal Menambahkan Pelajaran', {color: 'danger'});
		  		this.modal.hideLoading();
		  		console.log(err)
		  	})
  		}
  	})
  }

  get jenisMateri(){
		return this.pelatihan.jenisMateri;
	}
}
