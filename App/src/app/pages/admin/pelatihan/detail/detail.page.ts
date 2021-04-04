import { Component, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PelatihanService, Pelatihan } from '../../../../services/pelatihan/pelatihan.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ServerService } from '../../../../services/server/server.service';
import { User } from '../../../../services/user/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();
  idPelatihan: string;
  dataPelatihan: Pelatihan;

  penerimaBelumLunas: User[] = [];
  penerimaLunas: User[] = [];

  penerimaBelumLoading = 0;
  penerimaLunasLoading = 0;

  constructor(
  	private navCtrl: NavController,
    private active: ActivatedRoute,
    private pelatihan: PelatihanService,
    private modal: ModalService,
    private server: ServerService
    ) {
  	active.params
  	.pipe(takeUntil(this.destroy$))
  	.subscribe(data => {
      this.idPelatihan = data.id;
      this.dataPelatihan = this.pelatihan.getValuePelatihan().find(v => v._id == data.id);
    })

    if(this.pelatihan.getValuePelatihan().length < 1){
      this.server.ambilPelatihan().then(data => {
        if(data.success){
          this.pelatihan.setDataPelatihan(data.pelatihan);
          this.dataPelatihan = data.pelatihan.find(v => v._id == this.idPelatihan);
        }
      })
    }
  }
  
  ngOnDestroy(){
  	this.destroy$.next();
  	this.destroy$.complete();
  }

  goBack(){
    this.navCtrl.back();
  }

  hapus(){
  	this.modal.showConfirm('Hapus Pelatihan', 'Apakan anda ingin menghapus pelatihan <b class="ion-text-capitalize">' + this.dataPelatihan.nama + '</b>', ['Batal', 'Hapus']).then(data => {
      if(data){
        this.modal.showLoading('Menghapus Data Pelatihan');
        this.server.hapusPelatihan(this.dataPelatihan._id).then(data => {
          console.log(data)
          this.modal.hideLoading();
          if(data.success){     
            this.pelatihan.setDataPelatihan(this.pelatihan.getValuePelatihan().filter(v => v._id != data.pelatihan._id));
            this.modal.showToast('Berhasil Menghapus Pelatihan', {color: 'success', aboveTab: true})
            setTimeout(_ => {
              this.goBack();
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


}
