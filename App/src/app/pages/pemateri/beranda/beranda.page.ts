import { Component, OnDestroy } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService }  from '../../../services/server/server.service';
import { StorageService } from '../../../services/storage/storage.service';
import { User } from '../../../services/user/user.service';

@Component({
  selector: 'app-beranda',
  templateUrl: 'beranda.page.html',
  styleUrls: ['beranda.page.scss']
})
export class BerandaPage implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userData: User;

  constructor(
    private server: ServerService,
    private storage: StorageService) {
  }

  ionViewDidEnter(){
    this.storage.getDecodedStorage('user:data').then((data: any) => {
      this.userData = data;
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
