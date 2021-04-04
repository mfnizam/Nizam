import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { StorageService } from '../../../services/storage/storage.service';
import { UserService, User } from '../../../services/user/user.service';
// import { TagihanService } from '../../../services/tagihan/tagihan.service';
// import { PembayaranService } from '../../../services/pembayaran/pembayaran.service';

@Component({
  selector: 'app-akun',
  templateUrl: 'akun.page.html',
  styleUrls: ['akun.page.scss']
})
export class AkunPage implements OnDestroy{
  private destroy$: Subject<void> = new Subject<void>();
  userData: User;

  constructor(
  	private router: Router,
  	private storage: StorageService,
    private user: UserService,
    /*private tagihan: TagihanService,
    private pembayaran: PembayaranService*/) {
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
  	this.storage.removeStorage('user:data').then(v => {
  		this.router.navigate(['/masuk']);

      // this.tagihan.setDataTagihan([]);
      // this.tagihan.setDataBayar([]);
      // this.tagihan.setDataHistori([]);

      // this.pembayaran.setDataPembayaran([]);
      // this.pembayaran.setDataHistori([]);
      // this.pembayaran.setDataBelum([])
      // this.pembayaran.setDataMenuggu([])
  	})
  }

}
