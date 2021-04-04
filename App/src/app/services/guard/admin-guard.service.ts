import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { StorageService } from '../storage/storage.service';
import { PelatihanService } from '../pelatihan/pelatihan.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(
  	private router: Router,
  	private storage: StorageService,
    private pelatihan: PelatihanService) { }

  canActivate(): Promise<boolean | UrlTree> {
    return this.storage.getDecodedStorage('user:data').then(data => {
      if(data['_id'] && data['isAdmin']){
        return true;
      }else if(data['_id']){
        return this.router.parseUrl('/');
      }else{
        return this.router.parseUrl('/masuk');
        this.pelatihan.setDataPelatihan([]);
      }
    }).catch(err => {
      console.log(err, 'err getStorage - canActivate - AuthGuardService');
      return this.router.parseUrl('/masuk');
      this.pelatihan.setDataPelatihan([]);
    })
  }
}
