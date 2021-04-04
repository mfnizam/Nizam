import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../services/server/server.service';
import { ModalService } from '../../../services/modal/modal.service';
import { PelatihanService, Pelatihan, Pelajaran } from '../../../services/pelatihan/pelatihan.service';
import { UserService } from '../../../services/user/user.service';

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
		private router: Router,
		private active: ActivatedRoute,
		private server: ServerService,
		private modal: ModalService,
		private pelatihan: PelatihanService,
		private user: UserService
		) {

		pelatihan.getDataPelatihanAktif()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.dataPelatihanAktif = data;
			console.log(this.dataPelatihanAktif, 'pelatihan aktif change')
			if(data) this.ambilPelajaran(data._id)
		})

		pelatihan.getDataPelajaran()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.dataPelajaran = data;
		})
	}

	ambilPelajaran(idPelatihan, idUser = this.user.getValueUser()?._id){
		if(!idPelatihan || !idUser) return;
		this.loadingPelajaran = 1;
		this.server.pelajaran({idPelatihan, idUser}).then(data => {
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

	ionViewDidEnter(){
		if(this.dataPelajaran) this.ambilPelajaran(this.dataPelatihanAktif._id);
	}

	ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  cuPelajaran(v){
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
  	// this.router.navigate(['cu'], { relativeTo: this.active });
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
