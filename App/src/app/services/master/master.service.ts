import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { User } from '../user/user.service';

export class Tingkatan{
	_id: string;
	title: string;
}

// export class Kelas{
// 	_id: string;
// 	title: string;
// 	totUser?: number;
// }

// export class Rekening{
//   _id: string;
//   namaBank: string;
//   noRek: string;
//   atasNama: string;
// }

@Injectable({
  providedIn: 'root'
})
export class MasterService {
	private dataPemateri: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([])
	dataPemateri_ = this.dataPemateri.asObservable();

	private dataPeserta: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([])
  dataPeserta_ = this.dataPeserta.asObservable();

	private dataTingkatan: BehaviorSubject<Array<Tingkatan>> = new BehaviorSubject<Array<Tingkatan>>([]);
	dataTingkatan_ = this.dataTingkatan.asObservable();

	// private dataKelas: BehaviorSubject<Array<Kelas>> = new BehaviorSubject<Array<Kelas>>([])	
	// dataKelas_ = this.dataKelas.asObservable();
 //  private dataRekening: BehaviorSubject<Array<Rekening>> = new BehaviorSubject<Array<Rekening>>([])
 //  dataRekening_ = this.dataRekening.asObservable();

  constructor() { }

  setDataTingkatan(data: Array<Tingkatan>){ this.dataTingkatan.next(data) }
  getDataTingkatan(){ return this.dataTingkatan_ }
  getValueTingkatan(){ return this.dataTingkatan.getValue() };

  setDataPemateri(data: Array<User>){ this.dataPemateri.next(data) }
  getDataPemateri(){ return this.dataPemateri_ }
  getValuePemateri(){ return this.dataPemateri.getValue() };

  setDataPeserta(data: Array<User>){ this.dataPeserta.next(data) }
  getDataPeserta(){ return this.dataPeserta_ }
  getValuePeserta(){ return this.dataPeserta.getValue() };

  // setDataKelas(data: Array<Kelas>){ this.dataKelas.next(data) }
  // getDataKelas(){ return this.dataKelas_ }
  // getValueKelas(){ return this.dataKelas.getValue() };

  // setDataRekening(data: Array<Rekening>){ this.dataRekening.next(data) }
  // getDataRekening(){ return this.dataRekening_ }
  // getValueRekening(){ return this.dataRekening.getValue() };
}
