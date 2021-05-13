import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  public serverUrl = 'https://projectkabeh.herokuapp.com/nizam/';
  // public serverUrl = 'http://192.168.8.103:3000/nizam/'; //F4
  // public serverUrl = 'http://192.168.43.64:3000/nizam/'

  public otherServer = 'https://mfnizam.com/apps/projectkabeh/'

  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
    private transfer: FileTransfer,
    private file: File) { }

  getRequest(url, opt?){
    let header = {}
    return this.httpClient.get(url, opt).toPromise();
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

  async uploadRequest(url, fileUrl, fileName, mime = "image/jpeg", params){
    if(Capacitor.isNative){
      return this.transfer.create().upload(fileUrl, url, {
        fileKey: 'file',
        fileName: fileName,
        chunkedMode: false,
        mimeType: mime,
        params : params,
        headers: {}
      })
      .then(res => { return JSON.parse(res.response) })
    }else{
      let file = await fetch(fileUrl).then(r => r.blob());
      let formData = new FormData();
      formData.append('file', file, (fileName? fileName : 'file-upload'));
      for(let k in params){
        formData.append(k, params[k]);
      }
      return this.postRequest(url, formData); 
    }
  }

  async downloadRequest(url, nama){
    if(Capacitor.isNative){
      return this.transfer.create().download(url, this.file.externalRootDirectory + '/Download/' + nama);
    }else{
      //kurang download non native
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
  public editPemateriPelatihan(data){
    let url = this.serverUrl + 'api/admin/pelatihan/pemateri/edit';
    return this.postRequest(url, data);
  }
  public editPesertaPelatihan(data){
    let url = this.serverUrl + 'api/admin/pelatihan/peserta/edit';
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
  public hasilPelajaran(data){
    let url = this.serverUrl + 'api/pelajaran/hasil';
    return this.postRequest(url, data);
  }
  public pengacakanPelajaran(data){
    let url = this.serverUrl + 'api/pelajaran/pengacakan';
    return this.postRequest(url, data);
  }

  public materi(data){
    let url = this.serverUrl + 'api/materi';
    return this.postRequest(url, data);
  }
  public async tambahMateri(data, hasFile = false, fileUrl?, fileName?, mime?){
    let url = this.serverUrl + 'api/materi/tambah';
    if(hasFile){
      return this.uploadRequest(url, fileUrl, fileName, mime, data)
    }else{
      return this.postRequest(url, data);
    }
  }
  public hapusMateri(_id){
    let url = this.serverUrl + 'api/materi/hapus';
    return this.postRequest(url, {_id});
  }
  public editMateri(data){
    let url = this.serverUrl + 'api/materi/edit';
    return this.postRequest(url, data);
  }
  public async downloadMateri(url, nama){
    // return await fetch(this.otherServer + url).then(r => r.blob());
    return this.downloadRequest(this.otherServer + url, nama)
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
  public pilihSoalMateri(data){
    let url = this.serverUrl + 'api/materi/soal/pilih';
    return this.postRequest(url, data);
  }
  public pilihanSoalMateri(data){
    let url = this.serverUrl + 'api/materi/soal/pilihan';
    return this.postRequest(url, data);
  }
  public urutanSoalMateri(data){
    let url = this.serverUrl + 'api/materi/soal/urutan';
    return this.postRequest(url, data); 
  }
}