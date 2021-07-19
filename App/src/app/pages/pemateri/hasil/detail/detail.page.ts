import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PelatihanService, Pelatihan, Pelajaran } from '../../../../services/pelatihan/pelatihan.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage {
	private destroy$: Subject<void> = new Subject<void>();
	
	idMateri;
	dataMateri;

  constructor(
  	private active: ActivatedRoute,
  	private navCtrl: NavController,
  	private pelatihan: PelatihanService) {
  	active.params
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.idMateri = data['idMateri'];
			this.dataMateri = this.pelatihan.getValuePelajaran().find(v => {
				return v.materi.some(s => s._id == this.idMateri)
			})?.materi.find(v => v._id == this.idMateri)
			console.log(this.dataMateri)
		})
  }

  goBack(){
    this.navCtrl.back();
  }

}
