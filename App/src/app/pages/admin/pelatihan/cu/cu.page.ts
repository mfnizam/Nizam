import { Component, OnDestroy, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MasterService, Tingkatan } from '../../../../services/master/master.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ModalComponent } from '../../../../services/modal/modal/modal.component';
import { ServerService } from '../../../../services/server/server.service';
import { PelatihanService, Pelatihan } from '../../../../services/pelatihan/pelatihan.service';
import { User } from '../../../../services/user/user.service';

@Component({
  selector: 'app-cu',
  templateUrl: './cu.page.html',
  styleUrls: ['./cu.page.scss'],
})
export class CuPage implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  update = false;
  idPelatihan: string;
  dataPelatihan: Pelatihan;
  dataTingkatan: Tingkatan[] = [];
  dataPemateri: User[] = [];
  dataPeserta: User[] = [];

  form: FormGroup = new FormGroup({
    // kode: new FormControl({value: null, disabled: true}, [Validators.required]),
    nama: new FormControl(null, [Validators.required]),
    tingkatan: new FormControl(null, [Validators.required]),
    tglPendaftaranMulai: new FormControl(null, [Validators.required]),
    tglPendaftaranAkhir: new FormControl(null, [Validators.required]),
    tglPelaksanaanMulai: new FormControl(null, [Validators.required]),
    tglPelaksanaanAkhir: new FormControl(null, [Validators.required]),
    imgUrl: new FormControl(),
    deskripsi: new FormControl(),
    biaya: new FormControl(0),
    pemateri: new FormControl([]),
    peserta: new FormControl([]),
  });

  tingkatan: Tingkatan[] = [];

  constructor(
  	private navCtrl: NavController,
    private active: ActivatedRoute,
    private modal: ModalService,
    private server: ServerService,
    private pelatihan: PelatihanService,
    private master: MasterService,
    private zone: NgZone) {
    active.params
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.idPelatihan = data['id'];
      this.update = data['update'] == 'true' || this.idPelatihan? true : false;
      this.setValueForm();
    })

    this.master.getDataTingkatan()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataTingkatan = data;
      if(data.length > 0 && this.dataPelatihan) {
        console.log('data fasdfjaskldfjl;asd;fj;asdf')
        this.form.controls.tingkatan.setValue(this.dataPelatihan.tingkatan._id? this.dataPelatihan.tingkatan._id : this.dataPelatihan.tingkatan);
      }
    })

    this.master.getDataPemateri()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPemateri = data;
      if(data && this.dataPelatihan) this.form.controls.pemateri.setValue(data.filter((v: any) => this.dataPelatihan.pemateri.map(v => v._id? v._id : v).includes(v._id)));
    })

    this.master.getDataPeserta()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataPeserta = data;
      if(data && this.dataPelatihan) this.form.controls.peserta.setValue(data.filter((v: any) => this.dataPelatihan.peserta.map(v => v._id? v._id : v).includes(v._id)));
    })
  }

  ionViewDidEnter(){
    if(this.update && this.dataPelatihan && this.dataPelatihan.deskripsi) this.form.controls.deskripsi.setValue(this.dataPelatihan.deskripsi);
    if(this.master.getValueTingkatan().length < 1 || this.master.getValuePemateri().length < 1){
      this.modal.showLoading('Memuat Data...');
      let ting = this.server.ambilTingkatan().catch(error => { return new Error(error) });
      let pem = this.server.ambilPemateri().catch(error => { return new Error(error) });
      let pes = this.server.ambilPeserta().catch(error => { return new Error(error) });
      Promise.all([ting, pem, pes]).then(data => {
        setTimeout(_ => { this.modal.hideLoading() }, 2000)
        console.log(data);
        if(data[0].success) this.master.setDataTingkatan(data[0].tingkatan);
        if(data[1].success) this.master.setDataPemateri(data[1].pemateri);
        if(data[2].success) this.master.setDataPeserta(data[2].peserta);
      })
    }
  }

  setValueForm(){
    if(this.update && this.idPelatihan){
      this.dataPelatihan = this.pelatihan.getValuePelatihan().find(v => v._id == this.idPelatihan);
      this.form.addControl('_id', new FormControl(this.idPelatihan, [Validators.required]));
      if(!this.dataPelatihan) return;
      console.log(this.dataPelatihan)
      // this.form.controls.kode.setValue(this.dataPelatihan.kode);
      this.form.controls.nama.setValue(this.dataPelatihan.nama);
      // this.form.controls.tingkatan.setValue(this.dataPelatihan.tingkatan._id);
      this.form.controls.tglPendaftaranMulai.setValue(this.dataPelatihan.tglPendaftaranMulai);
      this.form.controls.tglPendaftaranAkhir.setValue(this.dataPelatihan.tglPendaftaranAkhir);
      this.form.controls.tglPelaksanaanMulai.setValue(this.dataPelatihan.tglPelaksanaanMulai);
      this.form.controls.tglPelaksanaanAkhir.setValue(this.dataPelatihan.tglPelaksanaanAkhir);
      this.form.controls.imgUrl.setValue(this.dataPelatihan.imgUrl);
      // this.form.controls.deskripsi.setValue(this.dataPelatihan.deskripsi);
      this.form.controls.biaya.setValue(this.dataPelatihan.biaya);
      this.form.controls.pemateri.setValue(this.dataPemateri.filter((v: any) => this.dataPelatihan.pemateri.map(v => v._id? v._id : v).includes(v._id)));
      this.form.controls.peserta.setValue(this.dataPeserta.filter((v: any) => this.dataPelatihan.peserta.map(v => v._id? v._id : v).includes(v._id)));
      if(this.dataTingkatan.length > 0) {
        this.form.controls.tingkatan.setValue(this.dataPelatihan.tingkatan._id? this.dataPelatihan.tingkatan._id : this.dataPelatihan.tingkatan);
      }
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(){
  	this.navCtrl.back();
  }

  tambahPemateri(){
    this.modal.showModal({
      jenis: 'select',
      header: 'Pilih Pemateri',
      data: this.dataPemateri.map((v: any) => { 
        return { id: v._id, title: v.namaLengkap, subTitle: '<small>' + (v.noTlp || '-') + '</small>', checked: this.form.controls.pemateri.value.map(v => v._id).includes(v._id) }
      }),
      button: [{ 
        title: 'Batal', 
        role: 'batal'
      }, {
        title: 'Pilih', 
        submit: true/* role pada submit selalu 'ok'*/
      }]
    }).then(data => {
      if(data.role == 'ok' && data.data){
        this.form.controls.pemateri.setValue(this.dataPemateri.filter(v => data.data[v._id]))
      }
    })
  }

  tambahPeserta(){
    this.modal.showModal({
      jenis: 'select',
      header: 'Pilih Peserta',
      data: this.dataPeserta.map((v: any) => { 
        return { id: v._id, title: v.namaLengkap, subTitle: '<small>' + (v.noKta || '-')+ '</small>', checked: this.form.controls.peserta.value.map(v => v._id).includes(v._id) }
      }),
      button: [{ 
        title: 'Batal', 
        role: 'batal'
      }, {
        title: 'Pilih', 
        submit: true/* role pada submit selalu 'ok'*/
      }]
    }).then(data => {
      if(data.role == 'ok' && data.data){
        this.form.controls.peserta.setValue(this.dataPeserta.filter(v => data.data[v._id]))
      }
    })
  }

  simpan(){
    this.modal.showLoading('Menyimpan Data Pelatihan...')
    // this.form.controls.pemateri.setValue(this.form.controls.pemateri.value.map(v => v._id));
    this.form.value.pemateri = this.form.controls.pemateri.value.map(v => v._id);
    this.form.value.peserta = this.form.controls.peserta.value.map(v => v._id);
    console.log(this.form.value);
    
    if(this.update){
      this.server.editPelatihan(this.form.value).then(data => {
        this.modal.hideLoading();
        console.log(data);
        if(data.success){
          this.modal.showToast('Berhasil Menyimpan Data Pelatihan', {color: 'success'});
          this.pelatihan.setDataPelatihan(this.pelatihan.getValuePelatihan().map(v => v._id == data.pelatihan._id? data.pelatihan : v));
          setTimeout(_ => {
            this.goBack();
          }, 500)
        }else{
          this.modal.showToast('Gagal Menyimpan Data Pelatihan', {color: 'danger'});
        }
      }).catch(err => {
        this.modal.hideLoading();
        this.modal.showToast('Gagal Menyimpan Data Pelatihan', {color: 'danger'});
        console.log(err)
      })
    }else{
      this.server.tambahPelatihan(this.form.value).then(data => {
        this.modal.hideLoading();
        console.log(data);
        if(data.success){
          this.modal.showToast('Berhasil Menambahkan Data Pelatihan', {color: 'success'});
          this.pelatihan.setDataPelatihan([...this.pelatihan.getValuePelatihan(), data.pelatihan]);
          setTimeout(_ => {
            this.goBack();
          }, 500)
        }else{
          this.modal.showToast('Gagal Menambahkan Data Pelatihan', {color: 'danger'});
        }
      }).catch(err => {
        this.modal.hideLoading();
        this.modal.showToast('Gagal Menambahkan Data Pelatihan', {color: 'danger'});
        console.log(err)
      })
    }
  }

}
