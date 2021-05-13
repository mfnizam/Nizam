import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServerService } from '../../../../services/server/server.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { PelatihanService } from '../../../../services/pelatihan/pelatihan.service';
import { UserService } from '../../../../services/user/user.service';
import { FileService } from '../../../../services/file/file.service';

import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-cu',
  templateUrl: './cu.page.html',
  styleUrls: ['./cu.page.scss'],
})
export class CuPage implements OnDestroy{
  private destroy$: Subject<void> = new Subject<void>();

  jenis = 'materi';
  update = false;
  idPelajaran;
  idMateri;
  idSoal;
  fileName;

  form: FormGroup = new FormGroup({
    idPelajaran: new FormControl(null, [this.cv('materi', true, false)]),
    idMateri: new FormControl(null, [this.cv('materi', false, true), this.cv('soal', true, false)]),
    jenis: new FormControl(null, [this.cv('materi')]),
    file: new FormControl(null, [this.cv3('materi')]),
    namaMateri: new FormControl(null, [this.cv3('materi')]),
    tglPelaksanaan: new FormControl(null, [this.cv('materi')]),
    waktuPelaksanaanMulai: new FormControl(null, [this.cv('materi')]),
    waktuPelaksanaanAkhir: new FormControl(null, [this.cv('materi')]),
    durasiPelaksanaan: new FormControl(null, [this.cv('materi'), this.dv()]),
    idSoal: new FormControl(null, [this.cv('soal', false, true)]),
    soalDeskripsi: new FormControl(null, [this.cv('soal')]),
    soalJawaban: new FormControl([], [this.cv('soal')]),
    soalKunci: new FormControl(null, [this.cv('soal')]),
  })

  isLoading = false;

  cv(t, c = true, u = true): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return this.form && this.form.get('jenis').value < 4 && ((this.update != c) || (this.update == u)) && !control.value && this.jenis == t? {err: 'required'} : null
    };
  }
  cv3(t): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {
      return this.form && this.form.get('jenis').value > 3 && !control.value && this.jenis == t? { err: 'required' } : null
    }; 
  }

  dv(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const date = new Date(control.value);
      return date.getHours() < 1 && date.getMinutes() < 1 ? {durasiIsValid: {value: control.value}} : null;
    };
  }

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private navCtrl: NavController,
    private server: ServerService,
    private modal: ModalService,
    private pelatihan: PelatihanService,
    private user: UserService,
    private file: FileService
    ) {
  	active.params
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if(!data) return;
      this.jenis = data['jenis']? data['jenis'] : 'materi';
      this.update = data['update']? true : false;
      this.idPelajaran = data['idPelajaran'];
      this.idMateri = data['idMateri'];
      this.idSoal = data['idSoal'];

      if(this.update) {
        // this.modal.showLoading('Memuat Data...')
        this.setFormValue(this.idMateri, this.idSoal);
      }else{
        this.form.controls.idPelajaran.setValue(this.idPelajaran);
        this.form.controls.idMateri.setValue(this.idMateri);
      }
    })
  }

  ionViewDidEnter(){
    if(this.update) {
      this.setFormValue(this.idMateri, this.idSoal);
    }
  }

  setFormValue(idMateri, idSoal){
    let d = this.pelatihan.getValuePelajaran().find(v => {
      return v.materi.some(e => e._id === idMateri);
    })?.materi.find(v => v._id === idMateri)

    this.form.controls.idMateri.setValue(idMateri);

    if(this.jenis == 'materi'){
      this.form.controls.jenis.setValue(d?.jenis);
      this.form.controls.jenis.disable()
      this.form.controls.tglPelaksanaan.setValue(d?.tglPelaksanaan);
      this.form.controls.waktuPelaksanaanMulai.setValue(d?.waktuPelaksanaanMulai);
      this.form.controls.waktuPelaksanaanAkhir.setValue(d?.waktuPelaksanaanAkhir);
      this.form.controls.durasiPelaksanaan.setValue(d?.durasiPelaksanaan);
    }else{
      let s = d?.soal.find(v => v._id == idSoal);
      if(!s) return;
      this.form.controls.idSoal.setValue(idSoal);
      this.form.controls.soalDeskripsi.setValue(s?.deskripsi);
      this.form.controls.soalJawaban.setValue(s?.jawaban);
      this.form.controls.soalKunci.setValue(s?.kunci);
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(){
    this.navCtrl.back();
  }

  jenisChange(){
    this.form.get('tglPelaksanaan').reset();
    this.form.get('waktuPelaksanaanMulai').reset();
    this.form.get('waktuPelaksanaanAkhir').reset();
    this.form.get('durasiPelaksanaan').reset();
    this.form.get('file').reset();
    this.form.get('namaMateri').reset();
  }

  pilihFile(){
    if(Capacitor.isNative){
      this.file.file("application/pdf").then(data => {
        console.log(data, 'from file');
        this.fileName = decodeURIComponent(data).split('/').slice(-1)[0];
        this.form.get('file').setValue(data);
      }).catch(err => {
        console.log(err);
      })
    }else {
      document.getElementById('file-input').click();
    }
  }

  fileInputChange(e){
    this.fileName = e.target.files[0].name
    this.form.get('file').setValue(URL.createObjectURL(e.target.files[0]));
  }

  simpan(){
    if(this.form.invalid) return;
    if(this.jenis == 'materi'){
      this.modal.showLoading('Menyimpan Materi...', false, 0);
      if(this.update){ // update file materi belum bisa
        this.server.editMateri(this.form.value).then(data => {
          console.log(data);
          this.modal.hideLoading();
          if(data.success){
            this.modal.showToast('Berhasil Menyimpan Materi', {color: 'success', aboveTab: true});
            this.pelatihan.setDataPelajaran(this.pelatihan.getValuePelajaran().map(v => {
              if(v._id == data.materi.pelajaran) {
                v.materi[v.materi.findIndex(v => v._id == data.materi._id)] = data.materi;
              }
              return v;
            }));
            setTimeout(_ => {
              this.goBack()
            }, 500)
          }else{
            this.modal.showToast('Gagal Menyimpan Materi', {color: 'danger'})
          }
        }).catch(err => {
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menyimpan Materi', {color: 'danger'})
          console.log(err)  
        })
      }else{
        this.server.tambahMateri(this.form.value, this.form.get('jenis').value > 3, this.form.get('file').value, this.fileName? encodeURI(this.fileName.split('.').slice(0, -1).join('.')) : null, 'application/pdf').then(data => {
          console.log(data);
          this.modal.hideLoading();
          if(data.success){
            this.modal.showToast('Berhasil Menyimpan Materi', {color: 'success', aboveTab: true});
            this.pelatihan.setDataPelajaran(this.pelatihan.getValuePelajaran().map(v => {
              if(v._id == data.materi.pelajaran) v.materi.push(data.materi)
                return v;
            }));
            setTimeout(_ => {
              this.router.navigate(['/pemateri/pelajaran/detail', {idMateri: data.materi._id}], { replaceUrl: true })
            }, 500)
          }else{
            this.modal.showToast('Gagal Menyimpan Materi', {color: 'danger'})
          }
        }).catch(err => {
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menyimpan Materi', {color: 'danger'})
          console.log(err)  
        })
      }
    }else{
      this.modal.showLoading('Menyimpan Soal...');
      if(this.update){
        console.log(this.form.value)
        this.server.editSoalMateri(this.form.value).then(data => {
          console.log(data);
          this.modal.hideLoading();
          if(data.success){
            this.modal.showToast('Berhasil Menyimpan Soal', {color: 'success', aboveTab: true});
            this.pelatihan.setDataPelajaran(this.pelatihan.getValuePelajaran().map(v => {
              let im = v.materi.findIndex(v => v._id == this.idMateri);
              if(im >= 0) {
                let is = v.materi[im].soal.findIndex(v => v._id == this.idSoal);
                if(is >= 0) v.materi[im].soal[is] = data.soal;
              }
              return v;
            }))
            setTimeout(_ => {
              this.goBack()
            }, 500)
          }else{
            this.modal.showToast('Gagal Menyimpan Soal', {color: 'danger'})
          }
        }).catch(err => {
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menyimpan Soal', {color: 'danger'})
          console.log(err)  
        })
      }else{
        this.form.value.soalJawaban = this.form.value.soalJawaban.map(v => { return {fid: v._id, deskripsi: v.deskripsi}})
        this.server.tambahSoalMateri(this.form.value).then(data => {
          console.log(data);
          this.modal.hideLoading();
          if(data.success){
            this.modal.showToast('Berhasil Menyimpan Soal', {color: 'success', aboveTab: true});

            this.pelatihan.setDataPelajaran(this.pelatihan.getValuePelajaran().map(v => {
              let im = v.materi.findIndex(v => v._id == this.form.value.idMateri);
              if(im >= 0) v.materi[im].soal = v.materi[im].soal? [...v.materi[im].soal, data.soal] : [data.soal];
              return v;
            }))
            setTimeout(_ => {
              this.goBack();
            }, 500)
          }else{
            this.modal.showToast('Gagal Menyimpan Soal', {color: 'danger'})
          }
        }).catch(err => {
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menyimpan Soal', {color: 'danger'})
          console.log(err)  
        })
      }
    }
  }

  cuJawaban(v?){
    this.modal.showPrompt('Tambah Jawaban', null, [{
      name: 'deskripsi',
      type: 'textarea',
      placeholder: 'Tulis Jawaban',
      value: v? v : undefined
    }], ['Batal', 'Tambah']).then(data => {
      console.log(data)
      if(data.role == 'ok' && data.data.values.deskripsi){
        let n = {
          _id: Date.now(), 
          deskripsi: data.data.values.deskripsi
        }
        this.form.controls.soalJawaban.setValue([...this.form.controls.soalJawaban.value, n])
      }
    })
  }
  hapusJawaban(_id){
    if(!this.form.controls.soalJawaban.value) return;
    this.modal.showConfirm('Hapus Jawaban', 'Anda yakin ingin menghapus jawaban ini?', ['Batal', 'Hapus']).then(data => {
      console.log(this.form.controls.soalJawaban.value)
      if(data){
        this.form.controls.soalJawaban.setValue(this.form.controls.soalJawaban.value.filter(v => v._id != _id))
      }
    })
  }
  pilihJawaban(_id){
    this.form.controls.soalKunci.setValue(_id);
  }
}
