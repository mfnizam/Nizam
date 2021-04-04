import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class ServerService {

  // public serverUrl = 'https://projek-satu.herokuapp.com/nizam';
  public serverUrl = 'http://192.168.0.100:3000/nizam/';
  // public serverUrl = 'http://10.209.25.230:3000/nizam';
  // public serverUrl = 'http://192.168.1.111:3000/nizam/';

  public otherServer = 'https://mfnizam.com/apps/projekkabeh/'

  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
    private transfer: FileTransfer) { }

  getRequest(url){
  	return this.httpClient.get(url);
  }

  postRequest(url, data){
    if(Capacitor.isNative){
      this.http.setDataSerializer('json');
      return this.http.post(url, data, {'Content-Type': 'application/json'})
      .then(res => { return JSON.parse(res.data) })
    }else{
    	return this.httpClient.post(url, data).toPromise().then((data : any) => { return data;})
    }
  }

  // auth api
  public predaftar(eAn, nama, pass, isEmail){
  	let url = this.serverUrl + 'auth/predaftar';
  	return this.postRequest(url, { eAn: eAn, namaLengkap: nama, password: pass, isEmail: isEmail });
  }
  public masuk(eAn, password, isEmail){
    let url = this.serverUrl + 'auth/masuk';
    return this.postRequest(url, { eAn: eAn, password: password, isEmail: isEmail });
  }
  public verifyKode(eAn, nama, kode, keperluan){
    let url = this.serverUrl + 'auth/verifykode';
    return this.postRequest(url, {eAn: eAn, namaLengkap: nama, kode: kode, keperluan: keperluan});
  }
  public akunEdit(data){
    let url = this.serverUrl + 'auth/akun/edit';
    return this.postRequest(url, data);
  }

  // admin api
  public ambilPemateri(){
    let url = this.serverUrl + 'api/admin/pemateri';
    return this.postRequest(url, {});
  }
  public tambahPemateri(data){
    let url = this.serverUrl + 'api/admin/pemateri/tambah';
    return this.postRequest(url, data)
  }
  public hapusPemateri(_id){
    let url = this.serverUrl + 'api/admin/pemateri/hapus';
    return this.postRequest(url, {_id})
  }
  public editPemateri(data){
    let url = this.serverUrl + 'api/admin/pemateri/edit';
    return this.postRequest(url, data);
  }

  public ambilPeserta(){
    let url = this.serverUrl + 'api/admin/peserta';
    return this.postRequest(url, {});
  }
  public tambahPeserta(data){
    let url = this.serverUrl + 'api/admin/peserta/tambah';
    return this.postRequest(url, data);
  }
  public hapusPeserta(_id){
    let url = this.serverUrl + 'api/admin/peserta/hapus';
    return this.postRequest(url, {_id})
  }
  public editPeserta(data){
    let url = this.serverUrl + 'api/admin/peserta/edit';
    return this.postRequest(url, data);
  }

  public ambilTingkatan(){
    let url = this.serverUrl + 'api/admin/tingkatan';
    return this.postRequest(url, {});
  }
  public tambahTingkatan(data){
    let url = this.serverUrl + 'api/admin/tingkatan/tambah';
    return this.postRequest(url, data)
  }
  public hapusTingkatan(_id){
    let url = this.serverUrl + 'api/admin/tingkatan/hapus';
    return this.postRequest(url, {_id});
  }
  public editTingkatan(data){
    let url = this.serverUrl + 'api/admin/tingkatan/edit';
    return this.postRequest(url, data);
  }

  public ambilPelatihan(){
    let url = this.serverUrl + 'api/admin/pelatihan';
    return this.postRequest(url, {});
  }
  public tambahPelatihan(data){
    let url = this.serverUrl + 'api/admin/pelatihan/tambah';
    return this.postRequest(url, data);
  }
  public hapusPelatihan(_id){
    let url = this.serverUrl + 'api/admin/pelatihan/hapus';
    return this.postRequest(url, {_id});
  }
  public editPelatihan(data){
    let url = this.serverUrl + 'api/admin/pelatihan/edit';
    return this.postRequest(url, data);
  }
  

  // public api
  public pelatihan(idUser){
    let url = this.serverUrl + 'api/pelatihan';
    return this.postRequest(url, {idUser});
  }

  public pelajaran(data){
    let url = this.serverUrl + 'api/pelajaran';
    return this.postRequest(url, data);
  }
  public tambahPelajaran(data){
    let url = this.serverUrl + 'api/pelajaran/tambah';
    return this.postRequest(url, data);
  }
  public hapusPelajaran(_id){
    let url = this.serverUrl + 'api/pelajaran/hapus';
    return this.postRequest(url, {_id});
  }
  public editPelajaran(data){
    let url = this.serverUrl + 'api/pelajaran/edit';
    return this.postRequest(url, data);
  }

  public materi(data){
    let url = this.serverUrl + 'api/materi';
    return this.postRequest(url, data);
  }
  public tambahMateri(data){
    let url = this.serverUrl + 'api/materi/tambah';
    return this.postRequest(url, data);
  }
  public hapusMateri(_id){
    let url = this.serverUrl + 'api/materi/hapus';
    return this.postRequest(url, {_id});
  }
  public editMateri(data){
    let url = this.serverUrl + 'api/materi/edit';
    return this.postRequest(url, data);
  }
  public tambahSoalMateri(data){
    let url = this.serverUrl + 'api/materi/soal/tambah';
    return this.postRequest(url, data);
  }
  public editSoalMateri(data){
    let url = this.serverUrl + 'api/materi/soal/edit';
    return this.postRequest(url, data);
  }
  public hapusSoalMateri(data){
    let url = this.serverUrl + 'api/materi/soal/hapus';
    return this.postRequest(url, data);
  }

  /*public ambilKelas(){
    let url = this.serverUrl + 'api/admin/kelas';
    return this.postRequest(url, {});
  }
  public tambahKelas(data){
    let url = this.serverUrl + 'api/admin/kelas/tambah';
    return this.postRequest(url, data);
  }
  public hapusKelas(_id){
    let url = this.serverUrl + 'api/admin/kelas/hapus';
    return this.postRequest(url, {_id});
  }
  public editKelas(data){
    let url = this.serverUrl + 'api/admin/kelas/edit';
    return this.postRequest(url, data);
  }

  public ambilRekening(){
    let url = this.serverUrl + 'api/admin/rekening';
    return this.postRequest(url, {});
  }
  public tambahRekening(data){
    let url = this.serverUrl + 'api/admin/rekening/tambah';
    return this.postRequest(url, data);
  }
  public hapusRekening(_id){
    let url = this.serverUrl + 'api/admin/rekening/hapus';
    return this.postRequest(url, {_id});
  }
  public editRekening(data){
    let url = this.serverUrl + 'api/admin/rekening/edit';
    return this.postRequest(url, data);
  }

  public ambilTagihanPenerima(_id){
    let url = this.serverUrl + 'api/admin/tagihan/penerima';
    return this.postRequest(url, {_id});
  }
  public ambilTagihanPenerimaBelumLunas(_id){
    let url = this.serverUrl + 'api/admin/tagihan/penerima/belumLunas';
    return this.postRequest(url, {_id});
  }
  public ambilTagihanPenerimaLunas(_id){
    let url = this.serverUrl + 'api/admin/tagihan/penerima/lunas';
    return this.postRequest(url, {_id});
  }

  public ambilPembayaran(status: number[]){
    let url = this.serverUrl + 'api/admin/pembayaran';
    return this.postRequest(url, {status: status});
  }
  public editPembayaran(data){
    let url = this.serverUrl + 'api/admin/pembayaran/bukti/verifikasi';
    return this.postRequest(url, data);
  }*/

  //public api
  /*public tagihan(idUser){
    let url = this.serverUrl + 'api/tagihan';
    return this.postRequest(url, {idUser});
  }
  public tagihanHistori(idUser){
    let url = this.serverUrl + 'api/tagihan/histori';
    return this.postRequest(url, {idUser});
  }

  public bayar(idUser){
    let url = this.serverUrl + 'api/bayar';
    return this.postRequest(url, {idUser});
  }
  public bayarTambah(idUser, idTagihan, idSiswa){
    let url = this.serverUrl + 'api/bayar/tambah';
    return this.postRequest(url, {idUser, idTagihan, idSiswa});
  }
  public bayarNanti(idUser, idTagihan, idSiswa){
    let url = this.serverUrl + 'api/bayar/nanti';
    return this.postRequest(url, {idUser, idTagihan, idSiswa});
  }
  public bayarPembayaran(idUser, rekening, bayar: Bayar[]){
    let url = this.serverUrl + 'api/bayar/pembayaran';
    return this.postRequest(url, {idUser, rekening, bayar})
  }

  public pembayaran(idUser){
    let url = this.serverUrl + 'api/pembayaran';
    return this.postRequest(url, {idUser})
  }
  public histori(idUser){
    let url = this.serverUrl + 'api/pembayaran/histori';
    return this.postRequest(url, {idUser})
  }
  public pembayaranBuktiUpload(imgUrl, fileName, params){
    let url = this.serverUrl + 'api/pembayaran/bukti/upload'
    return this.transfer.create().upload(imgUrl, url, {
      fileKey: 'foto',
      fileName: fileName,
      chunkedMode: false,
      mimeType: "image/jpeg",
      params : params,
      headers: {}
    })
    .then(res => { return JSON.parse(res.response) })
  }*/
}