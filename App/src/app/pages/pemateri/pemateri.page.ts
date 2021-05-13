import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../services/server/server.service';
import { StorageService } from '../../services/storage/storage.service';
import { UserService, User } from '../../services/user/user.service';
import { PelatihanService } from '../../services/pelatihan/pelatihan.service';

import { AnimationController, Animation } from '@ionic/angular';

@Component({
	selector: 'app-pemateri',
	templateUrl: 'pemateri.page.html',
	styleUrls: ['pemateri.page.scss']
})
export class PemateriPage implements OnDestroy {
	private destroy$: Subject<void> = new Subject<void>();

	userData: User;
	
	// @ViewChild('tagihanTab', { read: ElementRef }) tagihanTab: ElementRef;
	// tabAnimationTagihan: Animation;

	jumlahTagihan = 0;
	jumlahBayar = 0;
	jumlahPembayaran = 0;

	constructor(
		private server: ServerService,
		private storage: StorageService,
		private animate: AnimationController,
		private user: UserService,
		private pelatihan: PelatihanService) {
		this.user.getDataUser()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			if(!data || !data._id) return
		})
		
		if(!this.user.getValueUser()){
			this.storage.getDecodedStorage('user:data').then((data: any) => {
				this.user.setDataUser(data);
			})
		}

		if(!this.pelatihan.getValuePelatihanAktif()){
			this.storage.getStorage('user:pelatihan').then(data => {
				this.pelatihan.setDataPelatihanAktif(data);
			})
		}
	}

	// ngAfterViewInit(){
	// 	this.tabAnimationBayar = this.animate.create()
	// 	.addElement(this.tagihanTab.nativeElement)
	// 	.duration(500)
	// 	.easing('ease-out')
	// 	.keyframes([
	// 		{ offset: 0, transform: 'scale(.6)' },
	// 		{ offset: 0.5, transform: 'scale(1.3)' },
	// 		{ offset: 0.7, transform: 'scale(.9)' },
	// 		{ offset: 1, transform: 'scale(1)' }
	// 		])
	// }

	ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
	}

}
