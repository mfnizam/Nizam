import { Component, OnDestroy } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService }  from '../../../services/server/server.service';
import { StorageService } from '../../../services/storage/storage.service';
import { UserService, User } from '../../../services/user/user.service';
import { PelatihanService, Pelatihan } from '../../../services/pelatihan/pelatihan.service';

@Component({
  selector: 'app-beranda',
  templateUrl: 'beranda.page.html'
})
export class BerandaPage implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userData: User;
  dataPelatihanAktif: Pelatihan = null;
  dataPelatihan: Pelatihan[] = null;

  constructor(
    private server: ServerService,
    private storage: StorageService,
    private user: UserService,
    private pelatihan: PelatihanService) {
    user.getDataUser()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.userData = data;
    })

    pelatihan.getDataPelatihanAktif()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPelatihanAktif = data;
      console.log(this.dataPelatihanAktif, 'pelatihan aktif change')
      // if(data) this.ambilPelajaran(data._id)
    })
  }

  ionViewDidEnter(){
    // this.storage.getDecodedStorage('user:data').then((data: any) => {
    //   this.userData = data;
    // })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
