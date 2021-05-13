import { Component, OnDestroy, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../../services/server/server.service';
import { StorageService } from '../../../../services/storage/storage.service';
import { UserService } from '../../../../services/user/user.service';
import { PelatihanService, Pelajaran, Materi } from '../../../../services/pelatihan/pelatihan.service';
import { ModalService } from '../../../../services/modal/modal.service';

import { AnimationController } from '@ionic/angular';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.page.html'
})
export class DetailPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

	idMateri = null;
	dataPelajaran: Pelajaran;
	dataMateri: Materi;	

	loadingPilihan = 0;

	constructor(
		private active: ActivatedRoute,
		private navCtrl: NavController,
		private server: ServerService,
		private storage: StorageService,
		private user: UserService,
		private pelatihan: PelatihanService,
		private modal: ModalService,
		private animate: AnimationController,) {
		active.params
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.idMateri = data['idMateri'];
			let d = this.pelatihan.getValuePelajaran().find(v => {
				return v.materi.some(e => e._id == this.idMateri);
			})
			if(!d) return;
			this.dataPelajaran = d;
			this.dataMateri = d.materi.find(v => v._id == this.idMateri)
		})

		pelatihan.getDataPelajaran()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			let d = data.find(v => {
				return v.materi.some(e => e._id == this.idMateri);
			})
			if(!d) return;
			this.dataPelajaran = d;
			this.dataMateri = d.materi.find(v => v._id == this.idMateri);
			// this.dataMateri = data.find(v => v.materi.some(e => e._id == this.idMateri))?.materi?.find(v => v._id == this.idMateri);
		})

		pelatihan.getDataPilihan()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			let pelajaran = this.pelatihan.getValuePelajaran().map(p => {
				p.materi.forEach(m => {
					m.soal.map(s => {
						let pi = data.find(v => v.materi == m._id)?.pilihan.find(v => v.soal == s._id)
						if(pi) s['pilihan'] = pi.pilihan;
						return s;
					})
				})
				return p;
			})
			this.pelatihan.setDataPelajaran(pelajaran);
		})

		if(!this.user.getValueUser()){
			this.storage.getDecodedStorage('user:data').then((udata: any) => {
				this.user.setDataUser(udata);
			})
		}

		if(!this.pelatihan.getValuePelatihanAktif()){
			this.storage.getStorage('user:pelatihan').then((data: any) => {
				this.pelatihan.setDataPelatihanAktif(data)
			})			
		}
	}

	ionViewDidEnter(){
		if(this.pelatihan.getValuePelajaran().length < 1){
			this.ambilPelajaran(this.pelatihan.getValuePelatihanAktif()._id, this.user.getValueUser()._id);
		}
		this.ambilPilihan(this.idMateri);
	}

	ambilPelajaran(idPelatihan, idUser = this.user.getValueUser()?._id){
		if(!idPelatihan || !idUser) return console.log('tidak id pelatihan dan id user');
		this.modal.showLoading('Mengambil data materi...')
		this.server.pengacakanPelajaran({idPelatihan, idUser}).then(data => {
			setTimeout(_ => {
				this.modal.hideLoading();
			}, 500)
			console.log(data)
			if(data.success){
				if(this.pelatihan.getValuePilihan().length > 0){
					console.log('pilihan ada')
					data.pelajaran.forEach(p => {
						p.materi.forEach(m => {
							m.soal.map(s => {
								let pi = this.pelatihan.getValuePilihan().find(v => v.materi == m._id)?.pilihan.find(v => v.soal == s._id)
								if(pi) s['pilihan'] = pi.pilihan
								return s;
							})
						})
						return p;
					})
				}
				this.pelatihan.setDataPelajaran(data.pelajaran);
			}
		}).catch(err => { 
			console.log(err);
			this.modal.hideLoading();
		})
	}

	ambilPilihan(idMateri, idUser = this.user.getValueUser()?._id){
		if(!idMateri || !idUser) return console.log('tidak id materi dan id user');
		if(!this.pelatihan.getValuePilihan().some(v => v.materi == this.idMateri)) this.loadingPilihan = 1;
		
		this.server.pilihanSoalMateri({idMateri, idUser}).then(data => {
			this.loadingPilihan = 0;
			console.log(data)
			if(this.pelatihan.getValuePilihan().length < 1 || !this.pelatihan.getValuePilihan().every(v => data.pilihan.some(s => s._id == v._id))){
				this.pelatihan.setDataPilihan([...this.pelatihan.getValuePilihan().filter(v => !data.pilihan.some(s => s._id == v._id)), ...data.pilihan]);
			}
		}).catch(err => { 
			console.log(err) 
			this.loadingPilihan = 2;
		})
	}

	ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
	}

	goBack(){
		this.navCtrl.back();
	}

	downloadMateri(url, nama = 'materi'){
		this.server.downloadMateri(url, nama + '.pdf')
		.then(data => {
			console.log(data)
		})
		// .then((blob) => URL.createObjectURL(blob))
		// .then((href) => {
		// 	Object.assign(document.createElement('a'), {
		// 		href,
		// 		download: 'filename.pdf',
		// 	}).click();
		// })
		.catch(err => {
			console.log(err)
		})
	}

	get jenisMateri(){
		return this.pelatihan.jenisMateri;
	}

	get otherServer(){
		return this.server.otherServer;	
	}

}
