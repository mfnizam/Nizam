import { Component, OnDestroy } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../services/server/server.service';
import { PelatihanService, Pelatihan, Materi } from '../../../services/pelatihan/pelatihan.service';

@Component({
  selector: 'app-hasil',
  templateUrl: './hasil.page.html',
  styleUrls: ['./hasil.page.scss'],
})
export class HasilPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

  jenis = 'semua';
  status = 'semua';

  dataPelatihanAktif: Pelatihan;
  dataHasil: Materi[] = [];

  constructor(
    private server: ServerService,
    private pelatihan: PelatihanService) {
    pelatihan.getDataPelatihanAktif()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPelatihanAktif = data;
    })
  }

  ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
  }
}
