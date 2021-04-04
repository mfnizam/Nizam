import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { StorageService } from '../storage/storage.service';
import { PelatihanService } from '../pelatihan/pelatihan.service';

@Injectable({
  providedIn: 'root'
})
export class PemateriGuardService implements CanActivate {

  constructor(
  	private router: Router,
  	private storage: StorageService,
    private pelatihan: PelatihanService) { }

  canActivate(): Promise<boolean | UrlTree> {
    return this.storage.getDecodedStorage('user:data').then(data => {
      if(data && data['_id'] && !data['isAdmin'] && data['status'] == 1){
        return true;
      }else if(data && data['_id'] && !data['isAdmin'] && data['status'] == 2){
        return this.router.parseUrl('/public');
      }else if(data && data['_id'] && data['isAdmin']){
        return this.router.parseUrl('/admin');
      }else{
        return this.router.parseUrl('/masuk');
        this.pelatihan.setDataPelatihan([]);
      }
    }).catch(err => {
      console.log(err, 'err getStorage - canActivate - PemateriGuardService');
      return this.router.parseUrl('/masuk');
      this.pelatihan.setDataPelatihan([]);
    })
  }
}
