import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MasterService } from '../../../../services/master/master.service';
import { User } from '../../../../services/user/user.service';
import { ServerService } from '../../../../services/server/server.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ModalComponent } from '../../../../services/modal/modal/modal.component';

@Component({
  selector: 'app-cu',
  templateUrl: './cu.page.html',
  styleUrls: ['./cu.page.scss'],
})
export class CuPage implements OnDestroy {
	private destroy$: Subject<void> = new Subject<void>();
  jenis;
  update = false;
  dataMaster;

  form: FormGroup = new FormGroup({
    namaLengkap: new FormControl(null, [Validators.required]),
    jenisKelamin: new FormControl(null, [Validators.required]),
  })

  gantiPass = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private active: ActivatedRoute,
    private navCtrl: NavController,
    private master: MasterService,
    private server: ServerService,
    private modal: ModalService) {
  	active.params
  	.pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if(!data['jenis']) return this.goBack();

      this.jenis = data['jenis'];
      this.update = data['update'] == 'true'? true : false;
      if(this.jenis == 'pemateri'){
        this.dataMaster = this.master.getValuePemateri().find(v => v._id == data['id']);
      }else if(this.jenis == 'peserta'){
        this.dataMaster = this.master.getValuePeserta().find(v => v._id == data['id']);
      }
      this.setForm();
    })

  }

  setForm(){
    if(this.update) this.form.addControl('_id', new FormControl (this.dataMaster?._id || null, [Validators.required]));
    this.form.controls.namaLengkap.setValue(this.dataMaster?.namaLengkap || null);
    this.form.controls.jenisKelamin.setValue(Number(this.dataMaster?.jenisKelamin));
    this.form.addControl('noKta', new FormControl(this.dataMaster?.noKta || null, [Validators.required]))
    this.form.addControl('kwarcab', new FormControl(this.dataMaster?.kwarcab || null, [Validators.required]))
    this.form.addControl('email', new FormControl(this.dataMaster?.email || null, [Validators.required, Validators.email]))
    this.form.addControl('noTlp', new FormControl(this.dataMaster?.noTlp || null))
    this.form.addControl('tglLahir', new FormControl(this.dataMaster?.tglLahir || null))
    this.form.addControl('alamat', new FormControl(this.dataMaster?.alamat || null))
    this.form.addControl('password', new FormControl(null, this.dataMaster?.hasPassword? [] : [Validators.required]))
    // this.form.addControl('siswa', new FormControl(this.dataMaster?.siswa? this.dataMaster?.siswa.map(v => v._id) : []));
    // this.dataSiswaUi = this.dataMaster?.siswa || [];
    // this.server.ambilSiswa().then(data => {
    //   if(data.success){
    //     this.master.setDataSiswa(data.siswa);
    //     this.dataSiswa = data.siswa;
    //   }
    // })
  }

  ngOnDestroy(){
  	this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(){
  	this.navCtrl.back();
  }

  simpan(){
    this.modal.showLoading('Menambahkan Data');
    if(this.update){
      if(this.jenis == 'pemateri'){
        this.server.editPemateri(this.form.value).then(data => {
          this.modal.hideLoading();
          console.log(data)
          if(data.success){
            let valPemateri = this.master.getValuePemateri();
            let ind = valPemateri.findIndex(e => e._id == data.pemateri._id);
            if(ind < 0) {
              this.modal.showToast('Gagal Menyimpan Data Wali Murid', {color: 'danger'});
              setTimeout(_ => {
                this.goBack();
              }, 500)
              return
            }else{
              valPemateri[ind] = data.pemateri;
              this.master.setDataPemateri(valPemateri);
              console.log(this.master.getValuePemateri());
              this.modal.showToast('Berhasil Menyimpan Data Wali Murid', {color: 'success'});
              setTimeout(_ => {
                this.goBack();
              }, 500)
            }
          }else{
            this.modal.showToast('Gagal Menyimpan Data Wali Murid', {color: 'danger'});
          }
        }).catch(err => {
          console.log(err);
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menyimpan Data Wali Murid', {color: 'danger'});
        })
      }else if(this.jenis == 'peserta'){
        this.server.editPeserta(this.form.value).then(data => {
          this.modal.hideLoading();
          if(data.success){
            let valPeserta = this.master.getValuePeserta();
            let ind = valPeserta.findIndex(e => e._id == data.peserta._id);
            if(ind < 0) {
              this.modal.showToast('Gagal Menyimpan Data Peserta', {color: 'danger'});
              setTimeout(_ => {
                this.goBack();
              }, 500)
              return
            }else{
              valPeserta[ind] = data.peserta;
              this.master.setDataPeserta(valPeserta);
              this.modal.showToast('Berhasil Menyimpan Data Peserta', {color: 'success'});
              setTimeout(_ => {
                this.goBack();
              }, 500)
            }
          }else{
            this.modal.showToast('Gagal Menyimpan Data Peserta', {color: 'danger'});
          }
        }).catch(err => {
          console.log(err);
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menyimpan Data Peserta', {color: 'danger'});
        })
      }
    }else{
      if(this.jenis == 'pemateri'){
        this.server.tambahPemateri(this.form.value).then(data => {
          this.modal.hideLoading();
          if(data.success){
            this.master.setDataPemateri([...this.master.getValuePemateri(), data.pemateri]);
            this.modal.showToast('Berhasil Menambahkan Pemateri', {color: 'success'});
            setTimeout(_ => {
              this.goBack();
            }, 500)
          }else{
            this.form.controls[data.errCol].setErrors({terdaftar: true});
            this.modal.showToast('Gagal Menambahkan Pemateri', {color: 'danger'});
          }
        }).catch(err => {
          console.log(err);
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menambahkan Pemateri', {color: 'danger'});
        })
      }else if(this.jenis == 'peserta'){
        this.server.tambahPeserta(this.form.value).then(data => {
          console.log(data, 'tambah Peserta')
          this.modal.hideLoading()
          if(data.success){
            this.master.setDataPeserta([...this.master.getValuePeserta(), data.peserta]);
            this.modal.showToast('Berhasil Menambahkan Peserta', {color: 'success'});
            setTimeout(_ => {
              this.goBack();
            }, 500)
          }else{
            this.form.controls[data.errCol].setErrors({terdaftar: true});
            this.modal.showToast('Gagal Menambahkan Peserta', {color: 'danger'});
          }
        }).catch(err => {
          console.log(err);
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menambahkan Peserta', {color: 'danger'});
        })
      }
    }
  }

  // pilihSiswa(){
  //   if(this.dataSiswa.length < 1) {
  //     this.modal.showToast("Tidak Ada Data Siswa", {color: 'warning'})
  //     return false;
  //   }

  //   let data = this.dataSiswa.map(v => { 
  //     return {
  //       id: v._id, 
  //       title: v.namaLengkap, 
  //       imgUrl: true,
  //       subTitle: '<small>' + v.kelas.title + ' - ' + v.nisn + '</small>',
  //       checked: this.dataSiswaUi.some(e => e._id == v._id),
  //       disabled: this.dataMaster?.siswa? this.dataMaster?.siswa.map(v => v._id).includes(v._id)? false : v.hasParent : v.hasParent
  //     };
  //   });

  //   this.modal.showModal({
  //     jenis: 'select',
  //     header: 'Pilih Siswa',
  //     data: data,
  //     button: [{ 
  //       title: 'Batal', 
  //       role: 'batal'
  //     }, {
  //       title: 'Pilih', 
  //       submit: true/* role pada submit selalu 'ok'*/
  //     }]
  //   }, ModalComponent).then(data => {
  //     console.log(data)
  //     if(data.role == 'ok'){
  //       this.dataSiswaUi = [];
  //       let wform = [];
  //       Object.keys(data.data).forEach((v: any) => {
  //         if(data.data[v]){
  //           wform.push(v);
  //           this.dataSiswaUi.push(this.dataSiswa.find(e => e._id == v));
  //         }
  //       })
  //       this.form.controls.siswa.setValue(wform);
  //     }
  //   })
  // }

  // hapusSiswa(id){
  //   if(this.form.controls.siswa){
  //     this.dataSiswaUi = this.dataSiswaUi.filter(v => v._id != id);
  //     this.form.controls.siswa.setValue(this.dataSiswaUi.filter(v => v._id != id).map(v => v._id));
  //   }
  // }

}
