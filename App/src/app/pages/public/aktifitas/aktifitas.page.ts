import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../services/server/server.service';

@Component({
	selector: 'app-aktifitas',
	templateUrl: 'aktifitas.page.html',
	styleUrls: ['aktifitas.page.scss']
})
export class AktifitasPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

	jenis = 'semua';
	status = 'semua';
	
	constructor(
		private server: ServerService
		) {
	}

	ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
