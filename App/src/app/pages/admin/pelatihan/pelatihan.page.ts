import { Component, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PelatihanService, Pelatihan } from '../../../services/pelatihan/pelatihan.service';
import { ModalService } from '../../../services/modal/modal.service';
import { ServerService } from '../../../services/server/server.service';
import { MasterService } from '../../../services/master/master.service';

import { AnimationController, Animation } from '@ionic/angular';

@Component({
  selector: 'app-pelatihan',
  templateUrl: './pelatihan.page.html',
  styleUrls: ['./pelatihan.page.scss'],
})
export class PelatihanPage implements OnDestroy{
  private destroy$: Subject<void> = new Subject<void>();
  dataPelatihan: Pelatihan[] = [];
  pelatihanLoading = 0;

  @ViewChildren('pelatihanList', { read: ElementRef }) pelatihanList: QueryList<ElementRef>;
  status = 'semua';
  tanggal = 'semua';
  
  constructor(
    private animate: AnimationController,
    private pelatihan: PelatihanService,
    private server: ServerService,
    private modal: ModalService,
    private master: MasterService) {

    this.pelatihan.getDataPelatihan()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPelatihan = data;
    })

    if(this.master.getValueTingkatan().length < 1 || this.master.getValuePemateri().length < 1){
      let ting = this.server.ambilTingkatan().catch(error => { return new Error(error) });
      let pem = this.server.ambilPemateri().catch(error => { return new Error(error) });
      Promise.all([ting, pem]).then(data => {
        console.log(data);
        if(data[0].success) this.master.setDataTingkatan(data[0].tingkatan);
        if(data[1].success) this.master.setDataPemateri(data[1].pemateri);
      })
    }
  }

  ionViewDidEnter(){
    this.ambilPelatihan();
  }

  ambilPelatihan(){
    this.pelatihanLoading = 1;
    this.server.ambilPelatihan().then(data => {
      console.log(data, 'ambilPelatihan')
      if(data.success){
        this.pelatihanLoading = 0;
        this.dataPelatihan = data.pelatihan;
        this.pelatihan.setDataPelatihan(data.pelatihan);
      }else{
        this.pelatihanLoading = 2;
      }
    }).catch(err => {
      this.pelatihanLoading = 2;
      console.log(err)
    })
  }
  hapusPelatihan(t, i){
    this.modal.showConfirm('Hapus Pelatihan', 'Apakan anda ingin menghapus pelatihan <b class="ion-text-capitalize">' + t.nama + '</b>', ['Batal', 'Hapus']).then(data => {
      if(data){
        this.modal.showLoading('Menghapus Data Pelatihan');
        const deleteAnimation = this.animate.create()
        .addElement(this.pelatihanList.toArray()[i].nativeElement)
        .duration(200)
        .easing('ease-out')
        .fromTo('opacity', '1', '0')
        .fromTo('transform', 'translateX(0)', 'translateX(-100%)');
        this.server.hapusPelatihan(t._id).then(data => {
          console.log(data)
          this.modal.hideLoading();
          if(data.success){     
            deleteAnimation.play();
            setTimeout(_ => {
              this.pelatihan.setDataPelatihan(this.pelatihan.getValuePelatihan().filter(v => v._id != data.pelatihan._id));
              this.modal.showToast('Berhasil Menghapus Pelatihan', {color: 'success', aboveTab: true})
            }, 500)
          }else{
            this.modal.showToast('Gagal Menghapus Pelatihan', {color: 'danger', aboveTab: true})
          }
        }).catch(err => {
          console.log(err)
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menghapus Pelatihan', {color: 'danger', aboveTab: true})
        })
      }
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
