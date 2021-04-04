import { Component, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PembayaranService, Pembayaran } from '../../../services/pembayaran/pembayaran.service';
import { ServerService } from '../../../services/server/server.service';
import { ModalService } from '../../../services/modal/modal.service';
import { ModalComponent } from '../../../services/modal/modal/modal.component';

@Component({
	selector: 'app-pendaftaran',
	templateUrl: './pendaftaran.page.html',
	styleUrls: ['./pendaftaran.page.scss'],
})
export class PendaftaranPage implements OnDestroy {
	private destroy$: Subject<void> = new Subject<void>();

	segmentValue = 'menunggu';
	
	dataMenunggu: Pembayaran[] = [];
	dataMenungguUi: Pembayaran[] = [];
	menungguLoading = 0;

	dataBelum: Pembayaran[] = []
	dataBelumUi: Pembayaran[] = [];
	belumLoading = 0;

	dataPembayaran: Pembayaran[] = [];
	dataPembayaranUi: Pembayaran[] = [];
	pembayaranLoading = 0;

	constructor(
		private pembayaran: PembayaranService,
		private server: ServerService,
		private modal: ModalService
		) {

		this.pembayaran.getDataMenuggu()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.dataMenunggu = data
			this.dataMenungguUi = data;
		})

		this.pembayaran.getDataBelum()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.dataBelum = data;
			this.dataBelumUi = data;
		})

		this.pembayaran.getDataPembayaran()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			console.log(data, 'data Lunas')
			this.dataPembayaran = data;
			this.dataPembayaranUi = data;
		})

	}

	ionViewDidEnter(){
		this.ambilPembayaran([0,1,2,3]);
	}

	ambilPembayaran(status: number[]){
		// if(status.includes(0)) this.belumLoading = 1;
		// if(status.includes(1)) this.menungguLoading = 1;
		// if(status.includes(2)) this.pembayaranLoading = 1;

		// this.server.ambilPembayaran(status).then(data => {
		// 	console.log(data);
		// 	if(data.success){
		// 		if(status.includes(0)) {
		// 			this.belumLoading = 0;
		// 			this.pembayaran.setDataBelum(data.pembayaran.filter(v => v.status == 0))
		// 		}

		// 		if(status.includes(1)) {
		// 			this.menungguLoading = 0;
		// 			this.pembayaran.setDataMenuggu(data.pembayaran.filter(v => v.status == 1 || v.status == 3));
		// 		}

		// 		if(status.includes(2)) {
		// 			this.pembayaranLoading = 0;
		// 			this.pembayaran.setDataPembayaran(data.pembayaran.filter(v => v.status == 2))
		// 		}

		// 	}else{
		// 		if(status.includes(0)) this.belumLoading = 2;
		// 		if(status.includes(1)) this.menungguLoading = 2;
		// 		if(status.includes(2)) this.pembayaranLoading = 2;
		// 	}
		// }).catch(err => {
		// 	console.log(err)
		// 	if(status.includes(0)) this.belumLoading = 2;
		// 	if(status.includes(1)) this.menungguLoading = 2;
		// 	if(status.includes(2)) this.pembayaranLoading = 2;
		// })
	}

	ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
	}

	verifikasiBukti(p){
		console.log(p);
		if(!p.buktiPembayaran || p.buktiPembayaran.length < 1) return this.modal.showToast('Gagal, Coba beberapa saat lagi..', {color: 'danger'})
		let dataBukti = p.buktiPembayaran[p.buktiPembayaran.length - 1];
		this.modal.showModal({
			jenis: 'photo',
			header: 'Verifikasi Bukti Pembayaran',
			search: false,
			data: [{
				id: 'photo',
				imgUrl: this.server.otherServer + dataBukti.imgUrl
			}],
			button: [{ 
				title: 'Batal', 
				role: 'batal'
			}, {
				title: 'Tolak', 
				role: 'notok'
			},{
				title: 'Verifikasi', 
				submit: true/* rele pada submit selalu 'ok'*/
			}]
		}).then(mdata => {
			// if(mdata.role == 'ok' || mdata.role == 'notok'){
			// 	this.modal.showLoading('Menyimpan data verifikasi');
			// 	this.server.editPembayaran({idPembayaran: p._id, statusBukti: mdata.role == 'ok'? 1 : 2, idBukti: dataBukti._id}).then(data => {
			// 		this.modal.hideLoading();
			// 		console.log(data);
			// 		if(data.success){
			// 			this.modal.showToast('Berhasil menyimpan data verifikasi', {color: 'success'});
			// 			if(mdata.role == 'ok'){
			// 				this.pembayaran.setDataMenuggu(this.pembayaran.getValueMenuggu().filter(v => v._id == data._id))
			// 				this.pembayaran.setDataPembayaran([...this.pembayaran.getValuePembayaran(), p]);
			// 			}else if(mdata.role == 'notok'){
			// 				this.pembayaran.setDataMenuggu(this.pembayaran.getValueMenuggu().map(v => v._id == data._id? v : data.pembayaran))
			// 			}else{
			// 				this.ambilPembayaran([0,1,2,3]);
			// 			}
			// 		}else{
			// 			this.modal.showToast('Gagal menyimpan data verifikasi', {color: 'danger'});
			// 		}
			// 	}).catch(err => {
			// 		this.modal.hideLoading();
			// 		this.modal.showToast('Gagal menyimpan data verifikasi', {color: 'danger'});
			// 		console.log(err);
			// 	})	
			// }
		})
	}

}
