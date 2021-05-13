import { Component, OnDestroy, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../../services/server/server.service';
import { PelatihanService, Pelajaran, Materi } from '../../../../services/pelatihan/pelatihan.service';
import { ModalService } from '../../../../services/modal/modal.service';

import { AnimationController } from '@ionic/angular';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.page.html',
	styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

	idMateri = null;
	dataPelajaran: Pelajaran;
	dataMateri: Materi;	

	loadingSoal = 0;
	loadingNoSoal = 0;

	@ViewChildren('soalList', { read: ElementRef }) soalList: QueryList<ElementRef>;

	constructor(
		private active: ActivatedRoute,
		private navCtrl: NavController,
		private server: ServerService,
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
			// console.log(data)
			this.dataMateri = data.find(v => v.materi.some(e => e._id == this.idMateri))?.materi?.find(v => v._id == this.idMateri);
		})

		// if(pelatihan.getValuePelajaran().length < 1){
		// 	this.modal.showLoading('Mengambil data materi...')
		// 	this.server.pelajaran
		// }
	}

	ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
	}

	goBack(){
		this.navCtrl.back();
	}

	hapus(jenis, nama, id){
		if(!id) return;
		this.modal.showConfirm('Hapus ' + this.jenisMateri[jenis].title, 'Yakin ingin menghapus <b class="ion-text-capitalize c-primary">' + this.jenisMateri[jenis].title + ' - ' + (this.dataMateri.namaMateri || '') + '</b> dari pelajaran  <b class="ion-text-capitalize">"' + nama + '"</b>', ['Batal', 'Hapus']).then(data => {
			if(!data) return;
			this.modal.showLoading('Menghapus materi "' + nama + '"');
			this.server.hapusMateri(id).then(data => {
				this.modal.hideLoading();
				if(data.success){
					this.modal.showToast('Berhasil Menghapus ' + this.jenisMateri[jenis].title, {color: 'success', aboveTab: true});
					this.pelatihan.setDataPelajaran(this.pelatihan.getValuePelajaran().map(v => {
						v.materi = v.materi.filter(e => e._id != this.idMateri)
						return v;
					}));
					this.goBack();
				}else{
					this.modal.showToast('Berhasil Menghapus ' + this.jenisMateri[jenis].title, {color: 'danger'})
				}
			}).catch(err => {
				this.modal.hideLoading();
				this.modal.showToast('Berhasil Menghapus ' + this.jenisMateri[jenis].title, {color: 'danger'});
				console.log(err)
			})
		})
	}

	ambilSoal(v?){
		
	}

	hapusSoal(i, id){
		if(!id) return;
		this.modal.showConfirm('Hapus Soal', 'Apakah anda ingin menghapus <b>Soal No ' + (i + 1) + '</b>?', ['Batal', 'Hapus']).then(data => {
			if(data){
				this.modal.showLoading('Menghapus Soal No ' + (i + 1) + '...');
				const deleteAnimation = this.animate.create()
				.addElement(this.soalList.toArray()[i].nativeElement)
				.duration(200)
				.easing('ease-out')
				.fromTo('opacity', '1', '0')
				.fromTo('transform', 'translateX(0)', 'translateX(-100%)');

				this.server.hapusSoalMateri({idSoal: id, idMateri: this.idMateri}).then(data => {
					console.log(data)
					this.modal.hideLoading();
					if(data.success){
						this.modal.showToast('Berhasil menghapus soal', {color: 'success', aboveTab: true});
						deleteAnimation.play();
						this.loadingNoSoal = 1;

						setTimeout(_ => {
							this.pelatihan.setDataPelajaran(this.pelatihan.getValuePelajaran().map(v => {
								let im = v.materi.findIndex(v => v._id == this.idMateri);
								if(im >= 0) v.materi[im].soal = v.materi[im].soal? v.materi[im].soal.filter(v => v._id != id) : v.materi[im].soal;
								return v;
							}))

							setTimeout(_ => {
								this.loadingNoSoal = 0;
							}, 1000)
						}, 500)
					}else{
						this.modal.showToast('Gagal menghapus soal', {color: 'danger', aboveTab: true})
					}
				}).catch(err => {
					this.modal.showToast('Gagal menghapus soal', {color: 'danger', aboveTab: true})
					console.log(err)
				})
			}
		})
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
