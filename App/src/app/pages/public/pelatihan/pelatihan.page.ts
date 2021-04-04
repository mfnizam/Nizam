import { Component, OnDestroy } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../services/server/server.service';

@Component({
  selector: 'app-pelatihan',
  templateUrl: './pelatihan.page.html',
  styleUrls: ['./pelatihan.page.scss'],
})
export class PelatihanPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

  jenis = 'semua';
  status = 'semua';

  constructor(
    private server: ServerService) {
  }

  ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
  }
}
