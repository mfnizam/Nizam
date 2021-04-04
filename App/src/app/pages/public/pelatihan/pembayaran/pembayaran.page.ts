import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PembayaranService, Pembayaran } from '../../../../services/pembayaran/pembayaran.service';

@Component({
  selector: 'app-pembayaran',
  templateUrl: './pembayaran.page.html',
  styleUrls: ['./pembayaran.page.scss'],
})
export class PembayaranPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

	dataPembayaran: Pembayaran;
  constructor(
    private navCtrl: NavController,
  	private active: ActivatedRoute,
  	private pembayaran: PembayaranService,
  ) {
  	this.active.params
  	.pipe(takeUntil(this.destroy$))
  	.subscribe(data => {
  		this.dataPembayaran = this.pembayaran.getValuePembayaran().find(v => v._id == data['id']);
  	})

  }

  ngOnDestroy(){
  	this.destroy$.next();
  	this.destroy$.complete();
  }

  goBack(){
    this.navCtrl.back();
  }
  
  unggahBuktiPembayaran(){

  }

}
