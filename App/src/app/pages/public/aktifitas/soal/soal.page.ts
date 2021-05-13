import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../../services/server/server.service';
import { StorageService } from '../../../../services/storage/storage.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { UserService, User } from '../../../../services/user/user.service';
import { PelatihanService, Soal } from '../../../../services/pelatihan/pelatihan.service';

@Component({
	selector: 'app-soal',
	templateUrl: './soal.page.html'
})
export class SoalPage implements OnDestroy {
	private destroy$: Subject<void> = new Subject<void>();

	dataUser: User;

	noSoal;
	idMateri;
	idSoal;

	dataSoal: Soal = null;

	constructor(
		private active: ActivatedRoute,
		private navCtrl: NavController,
		private server: ServerService,
		private storage: StorageService,
		private modal: ModalService,
		private user: UserService,
		private pelatihan: PelatihanService) {
		active.params
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.noSoal = data['noSoal'];
			this.idMateri = data['idMateri'];
			this.idSoal = data['idSoal'];

			let d = this.pelatihan.getValuePelajaran().find(v => {
				return v.materi.some(e => e._id == this.idMateri);
			})
			if(!d) return;
			this.dataSoal = {...d.materi.find(v => v._id == this.idMateri).soal.find(v => v._id == this.idSoal)};
		})

		user.getDataUser()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.dataUser = data;
		})
	}

	ionViewDidEnter(){
		if(!this.user.getValueUser()){
			this.storage.getDecodedStorage('user:data').then((data: any) => {
				this.user.setDataUser(data)
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

	pilihJawaban(id){
		this.dataSoal['pilihan'] = id;
	}

	simpan(){
		this.modal.showLoading('Menyimpan Jawaban Anda..', false, 0);
		this.server.pilihSoalMateri({idUser: this.dataUser?._id, idMateri: this.idMateri, idSoal: this.idSoal, idPilihan: this.dataSoal?.pilihan}).then(data => {
			this.modal.hideLoading();
			console.log(data)
			if(data.success){
				let p = this.pelatihan.getValuePelajaran().find(v => {
					return v.materi.some(e => e._id == this.idMateri);
				})
				if(!p) return this.modal.showToast('Gagal Menyimpan, Coba Beberapa Saat Lagi..', {color: 'danger'});
				p.materi.forEach(v => {
					v.soal = v.soal.map(v => v._id == this.idSoal? this.dataSoal : v)
				})
				this.pelatihan.setDataPelajaran(this.pelatihan.getValuePelajaran().map(v => v._id == p._id? p : v));
				this.pelatihan.setDataPilihan([...this.pelatihan.getValuePilihan().filter(v => v._id != data.pilih._id), data.pilih]);
				console.log(this.pelatihan.getValuePilihan())
				
				this.modal.showToast('Berhasil Menyimpan Jawaban', {color: 'success'})
				this.goBack();
			}else{
				this.modal.showToast('Gagal Menyimpan Jawaban', {color: 'danger'})	
			}
		}).catch(err => {
			this.modal.showToast('Gagal Menyimpan Jawaban', {color: 'danger'})
			this.modal.hideLoading();
			console.log(err)
		})


	}
}
