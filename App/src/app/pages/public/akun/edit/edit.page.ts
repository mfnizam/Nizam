import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageService } from '../../../../services/storage/storage.service';
import { ServerService } from '../../../../services/server/server.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage {
	userData: any; 
  gantiPass = false;
  showPass = false;

  form: FormGroup = new FormGroup({
    idUser: new FormControl(null, [Validators.required]),
    status: new FormControl(null, [Validators.required]),
    namaLengkap: new FormControl(null, [Validators.required]),
    noKta: new FormControl(null, [Validators.required]),
    kwarcab: new FormControl(null, [Validators.required]),
    noTlp: new FormControl(null),
    alamat: new FormControl(null),
    tglLahir: new FormControl(null),
    jenisKelamin: new FormControl(null),
    email: new FormControl(null),
    password: new FormControl(null),
    confPassword: new FormControl(null),
  })

  isLoading = false;

  constructor(
  	private navCtrl: NavController,
  	private storage: StorageService,
    private server: ServerService,
    private modal: ModalService,
    private user: UserService) {
  }

  ionViewDidEnter(){
  	this.storage.getDecodedStorage('user:data').then((data: any) => {
      this.userData = data;
      if(data._id) this.form.controls.idUser.setValue(data._id);
      if(data.status) this.form.controls.status.setValue(data.status);
      if(data.namaLengkap) this.form.controls.namaLengkap.setValue(data.namaLengkap);
      if(data.noKta) this.form.controls.noKta.setValue(data.noKta);
      if(data.kwarcab) this.form.controls.kwarcab.setValue(data.kwarcab);
      if(data.noTlp) this.form.controls.noTlp.setValue(data.noTlp);
      if(data.alamat) this.form.controls.alamat.setValue(data.alamat);
      if(data.tglLahir) this.form.controls.tglLahir.setValue(data.tglLahir);
      if(data.jenisKelamin) this.form.controls.jenisKelamin.setValue(data.jenisKelamin);
      if(data.email) this.form.controls.email.setValue(data.email);
      console.log(this.form.value)
    })
  }

  goBack(){
    this.navCtrl.back();
  }

  simpan(){
    this.isLoading = true;
    this.server.akunEdit(this.form.value).then(data => {
      this.isLoading = false;
      console.log(data)
      if(data.success){
        this.storage.setStorage('user:data', data.token).then(data => {
          this.storage.getDecodedStorage('user:data').then((data: any) => {
            this.user.setDataUser(data);
            this.goBack();
          })
        })
      }else{
        this.modal.showToast('Gagal Menyimpan Data, Coba beberapa saat lagi.', {color: 'danger'});
      }
    }).catch(err => {
      this.isLoading = false;
      this.modal.showToast('Gagal Menyimpan Data, Coba beberapa saat lagi.', {color: 'danger'});
      console.log(err);
    })
  }

}
