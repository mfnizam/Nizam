import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MasterService } from '../../../../services/master/master.service';
import { User } from '../../../../services/user/user.service';
import { ServerService } from '../../../../services/server/server.service';
import { ModalService } from '../../../../services/modal/modal.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

	jenis;
	dataMaster;
  tagihanLoading = 0;

  constructor(
  	private navCtrl: NavController,
    private router: Router,
    private active: ActivatedRoute,
    private master: MasterService,
    private server: ServerService,
    private modal: ModalService
    ) {
  	active.params
  	.pipe(takeUntil(this.destroy$))
  	.subscribe(data => {
  		this.jenis = data['jenis'];
      if(this.jenis == 'pemateri'){
        this.dataMaster = this.master.getValuePemateri().find(v => v._id == data['id']);
      }else if(this.jenis == 'peserta'){
        this.dataMaster = this.master.getValuePeserta().find(v => v._id == data['id']);
      }
    })
  }

  ngOnDestroy(){
  	this.destroy$.next();
  	this.destroy$.complete();
  }

  goBack(){
    this.navCtrl.back();
  }

  edit(){
    if(!this.dataMaster || !this.dataMaster._id) return console.log('tidak ada id');
    if(this.jenis == 'pemateri' || this.jenis == 'peserta'){
      this.router.navigate(['/admin/master/cu', {jenis: this.jenis, update: true, id: this.dataMaster._id}]);
    }else if(this.jenis == 'tingkatan'){
      let input = [{
        name: 'title',
        type: 'text',
        value: this.dataMaster.title,
        placeholder: 'Isikan nama ' + this.jenis
      }]

      this.modal.showPrompt('Edit Data ' + this.jenis, null, input).then((data: any) => {
        if(data.data && data.data.values && data.role == 'ok'){
          this.modal.showLoading('Menyimpan Perubahan');
          data.data.values['_id'] = this.dataMaster._id;

          if(this.jenis == 'tingkatan'){
            this.server.editTingkatan(data.data.values).then(data => {
              this.modal.hideLoading();
              console.log(data);
              if(data.success){
                this.dataMaster = data.tingkatan;
                this.master.setDataTingkatan(this.master.getValueTingkatan().map(v => v._id == this.dataMaster._id? this.dataMaster : v));
                this.modal.showToast('Berhasil Menyimpan "' + this.dataMaster.title, {color: 'success'});
              }else{
                this.modal.showToast('Gagal Menyimpan "' + this.dataMaster.title, {color: 'danger'});
              }
            }).catch(err => {
              console.log(err);
              this.modal.hideLoading();
              this.modal.showToast('Gagal Menyimpan "' + this.dataMaster.title, {color: 'danger'});
            })
          }
        }
      })
    }
  }
  
  hapus(){
    if(!this.dataMaster || !this.dataMaster._id) return;
    let dataHapus = this.jenis == 'pemateri' || this.jenis == 'peserta'? this.dataMaster.namaLengkap : this.dataMaster.title;
    this.modal.showConfirm('Hapus Data ' + this.jenis, 'Apakah anda ingin menghapus data ' + this.jenis + ' <b>"' + dataHapus + '"</b>', ['Batal', 'Hapus']).then(e => {
      if(e){
        if(this.jenis == 'pemateri'){
          this.server.hapusPemateri(this.dataMaster._id).then(data => {
            this.modal.hideLoading();
            if(data.success){
              this.master.setDataPemateri(this.master.getValuePemateri().filter(v => v._id != this.dataMaster._id));
              this.modal.showToast('Berhasil Menghapus Data', {color: 'success'});
              setTimeout(_ => {
                this.goBack()
              }, 300)
            }else{
              this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
            }
          }).catch(err => {
            this.modal.hideLoading();
            this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
            console.log(err);
          })
        }else if(this.jenis == 'peserta'){
          this.server.hapusPeserta(this.dataMaster._id).then(data => {
            console.log(data);
            this.modal.hideLoading();
            if(data.success){
              this.master.setDataPeserta(this.master.getValuePeserta().filter(v => v._id != this.dataMaster._id));
              this.modal.showToast('Berhasil Menghapus Data', {color: 'success'})
              setTimeout(_ => {
                this.goBack()
              }, 300)
            }else{
              this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
            }
          }).catch(err => {
            this.modal.hideLoading();
            this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
            console.log(err)
          })
        }/*else if(this.jenis == 'tingkatan'){
          this.server.hapusTingkatan(this.dataMaster._id).then(data => {
            console.log(data);
            this.modal.hideLoading();
            if(data.success){
              this.master.setDataTingkatan(this.master.getValueTingkatan().filter(v => v._id != this.dataMaster._id));
              this.modal.showToast('Berhasil Menghapus Data', {color: 'success'})
              setTimeout(_ => {
                this.goBack();
              }, 300)
            }else{
              this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
            }
          }).catch(err => {
            this.modal.hideLoading();
            this.modal.showToast('Gagal Menghapus Data ' + dataHapus, {color: 'danger'})
            console.log(err)
          })
        }*/ 
      }
    })
  }
}
