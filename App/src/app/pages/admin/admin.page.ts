import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// import { PembayaranService } from '../../services/pembayaran/pembayaran.service';
import { ServerService } from '../../services/server/server.service';

import { AnimationController, Animation } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
})
export class AdminPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

	@ViewChild('pembayaranTab', { read: ElementRef }) pembayaranTab: ElementRef;
	tabAnimationPembayaran: Animation;
	jumlahPendaftaran = 0;
  

  constructor(
  	private animate: AnimationController,
  	// private pembayaran: PembayaranService,
  	private server: ServerService) {
  	// this.pembayaran.getDataMenuggu()
  	// .pipe(takeUntil(this.destroy$))
  	// .subscribe(data => {
  	// 	if(this.tabAnimationPembayaran && data.length > 0 && this.jumlahPembayaran != data.length) this.tabAnimationPembayaran.play();
  	// 	this.jumlahPembayaran = data.length;
  	// })
  	// this.ambilPembayaran([1,3])
  }

 //  ngAfterViewInit(){
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

	// ambilPembayaran(status: number[]){
	// 	this.server.ambilPembayaran(status).then(data => {
	// 		console.log(data);
	// 		if(data.success){
	// 			if(status.includes(0)) this.pembayaran.setDataBelum(data.pembayaran.filter(v => v.status == 0))
	// 			if(status.includes(1)) this.pembayaran.setDataMenuggu(data.pembayaran.filter(v => v.status == 1 || v.status == 3));
	// 			if(status.includes(2)) this.pembayaran.setDataPembayaran(data.pembayaran.filter(v => v.status == 2))
	// 		}
	// 	}).catch(err => {
	// 		console.log(err)
	// 	})
	// }

  ngOnDestroy(){
  	this.destroy$.next();
  	this.destroy$.complete();
  }

}
