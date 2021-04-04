import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import { TagihanService } from '../../services/tagihan/tagihan.service';
// import { PembayaranService } from '../../services/pembayaran/pembayaran.service';
import { ServerService } from '../../services/server/server.service';
import { StorageService } from '../../services/storage/storage.service';
import { UserService, User } from '../../services/user/user.service';

import { AnimationController, Animation } from '@ionic/angular';

@Component({
	selector: 'app-public',
	templateUrl: 'public.page.html',
	styleUrls: ['public.page.scss']
})
export class PublicPage implements OnDestroy {
	private destroy$: Subject<void> = new Subject<void>();

	userData: User;
	
	@ViewChild('tagihanTab', { read: ElementRef }) tagihanTab: ElementRef;
	tabAnimationTagihan: Animation;

	@ViewChild('bayarTab', { read: ElementRef }) bayarTab: ElementRef;
	tabAnimationBayar: Animation;

	@ViewChild('pembayaranTab', { read: ElementRef }) pembayaranTab: ElementRef;
	tabAnimationPembayaran: Animation;

	jumlahTagihan = 0;
	jumlahBayar = 0;
	jumlahPembayaran = 0;

	constructor(
		// private tagihan: TagihanService,
		// private pembayaran: PembayaranService,
		private server: ServerService,
		private storage: StorageService,
		private animate: AnimationController,
		private user: UserService) {

		// this.tagihan.getDataTagihan()
		// .pipe(takeUntil(this.destroy$))
		// .subscribe(data => {
		// 	if(this.tabAnimationTagihan && data.length > 0 && this.jumlahTagihan != data.length) this.tabAnimationTagihan.play();
		// 	this.jumlahTagihan = data.length;
		// })

		// this.tagihan.getDataBayar()
		// .pipe(takeUntil(this.destroy$))
		// .subscribe(data => {
		// 	if(this.tabAnimationBayar && data.length > 0 && this.jumlahBayar != data.length) this.tabAnimationBayar.play();
		// 	this.jumlahBayar = data.length;
		// })

		// this.pembayaran.getDataPembayaran()
		// .pipe(takeUntil(this.destroy$))
		// .subscribe(data => {
		// 	if(this.tabAnimationPembayaran && data.length > 0 && this.jumlahPembayaran != data.length) this.tabAnimationPembayaran.play();
		// 	this.jumlahPembayaran = data.length;
		// })


		this.user.getDataUser()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			if(!data || !data._id) return
			// this.server.tagihan(data._id).then(data => {
			// 	console.log(data, 'tagihan dari PublicPage')
			// 	if(data.success) this.tagihan.setDataTagihan(data.tagihan.filter(v => !this.tagihan.getValueBayar().map(v => v._id + '--' + v.siswa._id).includes(v._id + '--' + v.siswa._id)));
			// })

			// this.server.bayar(data._id).then(data => {
			// 	console.log(data, 'bayar dari PublicPage')
			// 	if(data.success) this.tagihan.setDataBayar(data.bayar);
			// })

			// this.server.pembayaran(data._id).then(data => {
			// 	console.log(data, 'pembayaran dari PublicPage')
			// 	if(data.success) this.pembayaran.setDataPembayaran(data.pembayaran);
			// })
		})
		
		if(!this.user.getValueUser()){
			this.storage.getDecodedStorage('user:data').then((data: any) => {
				this.user.setDataUser(data);
			})
		}
	
	}

	// ngAfterViewInit(){
 //    this.tabAnimationBayar = this.animate.create()
 //    .addElement(this.tagihanTab.nativeElement)
 //    .duration(500)
 //    .easing('ease-out')
 //    .keyframes([
 //    	{ offset: 0, transform: 'scale(.6)' },
 //    	{ offset: 0.5, transform: 'scale(1.3)' },
 //    	{ offset: 0.7, transform: 'scale(.9)' },
 //    	{ offset: 1, transform: 'scale(1)' }
 //    ])

 //    this.tabAnimationBayar = this.animate.create()
 //    .addElement(this.bayarTab.nativeElement)
 //    .duration(500)
 //    .easing('ease-out')
 //    .keyframes([
 //    	{ offset: 0, transform: 'scale(.6)' },
 //    	{ offset: 0.5, transform: 'scale(1.3)' },
 //    	{ offset: 0.7, transform: 'scale(.9)' },
 //    	{ offset: 1, transform: 'scale(1)' }
 //    ])

 //    this.tabAnimationPembayaran = this.animate.create()
 //    .addElement(this.pembayaranTab.nativeElement)
 //    .duration(500)
 //    .easing('ease-out')
 //    .keyframes([
 //    	{ offset: 0, transform: 'scale(.6)' },
 //    	{ offset: 0.5, transform: 'scale(1.3)' },
 //    	{ offset: 0.7, transform: 'scale(.9)' },
 //    	{ offset: 1, transform: 'scale(1)' }
 //    ])
	// }

	ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
	}

}
