import { Component, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MasterService, Tingkatan } from '../../../services/master/master.service';
import { User } from '../../../services/user/user.service';
import { ServerService } from '../../../services/server/server.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.page.html',
  styleUrls: ['./master.page.scss'],
})
export class MasterPage implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  dataPemateri: User[] = [];
  pemateriLoading = 0; // 0 done; 1 loading; 2 error
  dataPeserta: User[] = [];
  pesertaLoading = 0;

  dataTingkatan: Tingkatan[] = [];
  tingkatanLoading = 0;

  constructor(
    private master: MasterService,
    private server: ServerService) {
    master.getDataPemateri()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPemateri = data;
    })

    master.getDataPeserta()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPeserta = data;
    })

    master.getDataTingkatan()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataTingkatan = data;
    })
  }

  ionViewDidEnter(){
    this.ambilPemateri();
    this.ambilPeserta();
    this.ambilTingkatan();
  }

  ambilPemateri(){
    this.pemateriLoading = 1;
    this.server.ambilPemateri().then(data => {
      if(data.success){
        this.pemateriLoading = 0;
        this.dataPemateri = data.pemateri;
        this.master.setDataPemateri(data.pemateri);
      }else{
        this.pemateriLoading = 2
      }
    }).catch(err => {
      this.pemateriLoading = 2;
      console.log(err);
    })
  }
  ambilPeserta(){
    this.pesertaLoading = 1;
    this.server.ambilPeserta().then(data => {
      if(data.success){
        this.pesertaLoading = 0;
        this.dataPeserta = data.peserta;
        this.master.setDataPeserta(data.peserta);
      }else{
        this.pesertaLoading = 2;
      }
    }).catch(err => {
      this.pesertaLoading = 2;
      console.log(err);
    })
  }
  ambilTingkatan(){
    this.tingkatanLoading = 1;
    this.server.ambilTingkatan().then(data => {
      if(data.success){
        this.tingkatanLoading = 0;
        this.dataTingkatan = data.tingkatan;
        this.master.setDataTingkatan(data.tingkatan);
      }else{
        this.tingkatanLoading = 2
      }
    }).catch(err => {
      this.tingkatanLoading = 2;
      console.log(err, 'ambil tingkatan')
    })
  }
  
  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
