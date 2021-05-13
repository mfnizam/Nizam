import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { StorageService } from '../../../services/storage/storage.service';
import { UserService, User } from '../../../services/user/user.service';
import { PelatihanService } from '../../../services/pelatihan/pelatihan.service';
// import { PembayaranService } from '../../../services/pembayaran/pembayaran.service';

@Component({
  selector: 'app-akun',
  templateUrl: 'akun.page.html'
})
export class AkunPage implements OnDestroy{
  private destroy$: Subject<void> = new Subject<void>();
  userData: User;

  constructor(
  	private router: Router,
  	private storage: StorageService,
    private user: UserService,
    private pelatihan: PelatihanService) {
    user.getDataUser()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.userData = data;
      console.log(data);
    })
    
    if(!this.user.getValueUser()){
      this.storage.getDecodedStorage('user:data').then((data: any) => {
        this.user.setDataUser(data);
      })
    }
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(){
    this.user.setDataUser(null);
    this.pelatihan.setDataPelatihanAktif(null);
    this.pelatihan.setDataPelatihan([]);
    this.pelatihan.setDataPelajaran([]);
    this.pelatihan.setDataMateri([]);
    this.pelatihan.setDataPilihan([]);
    this.storage.removeStorage('user:pelatihan');
    this.storage.removeStorage('user:data').then(v => {
      this.router.navigate(['/masuk']);
    })
  }

}
