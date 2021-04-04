import { Component, OnInit, OnDestroy, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MasterService, Tingkatan } from '../../../../services/master/master.service';
import { User } from '../../../../services/user/user.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ServerService } from '../../../../services/server/server.service';

import { AnimationController } from '@ionic/angular';

@Component({
	selector: 'app-data',
	templateUrl: './data.page.html',
	styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit, OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();
	
	jenis;

	dataPe: User[] = [];
	peLoading = 0;

	dataTingkatan: Tingkatan[] = [];
	tingkatanLoading = 0;

	@ViewChildren('masterList', { read: ElementRef }) masterList: QueryList<ElementRef>;

	constructor(
		private router: Router,
		private active: ActivatedRoute,
		private navCtrl: NavController,
		private master: MasterService,
		private modal: ModalService,
		private animate: AnimationController,
		private server: ServerService) {
		active.params
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.jenis = data['data'];

			if(this.jenis == 'pemateri'){
				master.getDataPemateri()
				.pipe(takeUntil(this.destroy$))
				.subscribe(data => {
					this.dataPe = data;
				})
			}else if(this.jenis == 'peserta'){
				master.getDataPeserta()
				.pipe(takeUntil(this.destroy$))
				.subscribe(data => {
					this.dataPe = data;
				})
			}else if(this.jenis == 'tingkatan'){
				master.getDataTingkatan()
				.pipe(takeUntil(this.destroy$))
				.subscribe(data => {
					this.dataTingkatan = data;
				})
			}
		})
	}

	ngOnInit(){
		if(this.jenis == 'peserta' && this.dataPe.length < 1){
			this.ambilPeserta();
		}else if(this.jenis == 'pemateri' && this.dataPe.length < 1){
			this.ambilPemateri();
		}else if(this.jenis == 'tingkatan' && this.dataTingkatan.length < 1){
			this.ambilTingkatan();
		}
	}

	ambilPeserta(){
		this.peLoading = 1;
		this.server.ambilPeserta().then(data => {
			this.peLoading = 0;
			if(data.success){
				this.dataPe = data.peserta;
				this.master.setDataPeserta(data.peserta);
			}else{
				this.peLoading = 2
			}
		}).catch(err => {
			console.log(err)
			this.peLoading = 2;
		})
	}

	ambilPemateri(){
		this.peLoading = 1;
		this.server.ambilPemateri().then(data => {
			console.log(data);
			this.peLoading = 0;
			if(data.success){
				this.dataPe = data.pemateri;
				this.master.setDataPemateri(data.pemateri);
			}else{
				this.peLoading = 2;
			}
		}).catch(err => {
			console.log(err);
			this.peLoading = 2;
		})
	}

	ambilTingkatan(){
		this.tingkatanLoading = 1;
		this.server.ambilTingkatan().then(data => {
			this.tingkatanLoading = 0;
			if(data.success){
				this.dataTingkatan = data.tingkatan;
				this.master.setDataTingkatan(data.tingkatan);
			}else{
				this.tingkatanLoading = 2;
			}
		}).catch(err => {
			this.tingkatanLoading = 2;
			console.log(err);
		})
	}

	ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
	}

	goBack(){
		this.navCtrl.back();
	}

	tambah(){
		if(this.jenis == 'pemateri' || this.jenis == 'peserta'){
			return this.router.navigate(['/admin/master/cu', { jenis: this.jenis }]);
		} 

		let input = [{
			name: 'title',
			type: 'text',
			placeholder: 'Isikan nama ' + this.jenis
		}]

		this.modal.showPrompt('Tambah Data ' + this.jenis, null, input).then((data: any) => {
			if(data.data && data.data.values && data.role == 'ok'){
				this.modal.showLoading('Menambahkan Data');

				if(this.jenis == 'tingkatan'){
					this.server.tambahTingkatan(data.data.values).then(data => {
						console.log(data)
						this.modal.hideLoading();

						if(data.success){
							this.modal.showToast('Berhasil Menambahkan Data Tingkatan', {color: 'success'});
							this.dataTingkatan.push(data.tingkatan);
							this.master.setDataTingkatan(this.dataTingkatan);
						}else{
							this.modal.showToast('Gagal Menambahkan Data Tingkatan', {color: 'danger'});
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menambahkan Data Tingkatan', {color: 'danger'});
						console.log(err)
					})
				}
			}
		})
	}

	edit(id, i){
		if(this.jenis == 'pemateri' || this.jenis == 'peserta') {
			let data: any = this.dataPe[i];
			if(!data._id) return;
			return this.router.navigate(['/admin/master/cu', { jenis: this.jenis, update: true, id: data._id }]);
		}

		let input = [{
			name: 'title',
			type: 'text',
			value: this.dataTingkatan[i].title,
			placeholder: 'Isikan nama ' + this.jenis
		}]

		this.modal.showPrompt('Edit Data ' + this.jenis, null, input).then((data: any) => {
			if(data.data && data.data.values && data.role == 'ok'){
				this.modal.showLoading('Menyimpan Perubahan');
				data.data.values['_id'] = id;

				if(this.jenis == 'tingkatan'){
					this.server.editTingkatan(data.data.values).then(data => {
						this.modal.hideLoading();
						console.log(data);
						if(data.success){
							this.dataTingkatan[i] = data.tingkatan;
							this.master.setDataTingkatan(this.master.getValueTingkatan().map(v => v._id == id? data.tingkatan : v));
							this.modal.showToast('Berhasil Menyimpan "' + this.dataTingkatan[i].title, {color: 'success'});
						}else{
							this.modal.showToast('Gagal Menyimpan "' + this.dataTingkatan[i].title, {color: 'danger'});
						}
					}).catch(err => {
						console.log(err);
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menyimpan "' + this.dataTingkatan[i].title, {color: 'danger'});
					})
				}
			}
		})
	}

	hapus(id, i){
		let dataHapus = this.jenis == 'pemateri' || this.jenis == 'peserta'? this.dataPe[i].namaLengkap : this.dataTingkatan[i].title;
		this.modal.showConfirm('Hapus Data ' + this.jenis, 'Apakah anda ingin menghapus data ' + this.jenis + ' <b>"' + dataHapus + '"</b>', ['Batal', 'Hapus']).then(e => {
			if(e){
				this.modal.showLoading('Menghapus Data "' + dataHapus + '"');
				const deleteAnimation = this.animate.create()
				.addElement(this.masterList.toArray()[i].nativeElement)
				.duration(200)
				.easing('ease-out')
				.fromTo('opacity', '1', '0')
				.fromTo('transform', 'translateX(0)', 'translateX(-100%)');

				if(this.jenis == 'pemateri'){
					this.server.hapusPemateri(id).then(data => {
						console.log(data);
						this.modal.hideLoading();
						if(data.success){
							deleteAnimation.play();
							setTimeout(_ => {
								this.master.setDataPemateri(this.dataPe.filter(v => v._id != id));
								this.modal.showToast('Berhasil Menghapus Data', {color: 'success'})
							}, 500)
						}else{
							this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
						console.log(err);
					})
				}else if(this.jenis == 'peserta'){
					this.server.hapusPeserta(id).then(data => {
						console.log(data);
						this.modal.hideLoading();
						if(data.success){
							deleteAnimation.play();
							setTimeout(_ => {
								this.master.setDataPeserta(this.dataPe.filter(v => v._id != id));
								this.modal.showToast('Berhasil Menghapus Data', {color: 'success'})
							}, 500)
						}else{
							this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
						console.log(err)
					})
				}else if(this.jenis == 'tingkatan'){
					this.server.hapusTingkatan(id).then(data => {
						this.modal.hideLoading();
						if(data.success){
							deleteAnimation.play();
							setTimeout(_ => {
								this.master.setDataTingkatan(this.dataTingkatan.filter(v => v._id != id));
								this.modal.showToast('Berhasil Menghapus Data', {color: 'success'})
							}, 500)
						}else{
							this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
						console.log(err)
					})
				}
			}
		})
	}
}
