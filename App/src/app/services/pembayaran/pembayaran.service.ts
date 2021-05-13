import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

// import { Kategori, Kelas, Siswa, Rekening } from '../master/master.service';
import { User } from '../user/user.service';

export class Pembayaran{
	_id: string;
	invoice: string;
	status: number;
	nominal: number = 0;
	user: User | string;
	// tagihan: {
	// 	title: string;
	// 	deskripsi: string;
	// 	nominal: number;
	// 	waktuMulai: Date;
	// 	waktuAkhir: Date;
	// 	kategori?: Kategori;
	// 	kategoriBackup?: any;
	// 	kelas?: Kelas[];
	// 	kelasBackup?: any;
	// 	siswa: Siswa;
	// 	siswaBackup?: any;
	// }[];
	// buktiPembayaran: {
	// 	verify: boolean,
	// 	imgUrl: string
	// }[];
	// waktuPelunasan: Date;
	// rekening?: Rekening;
	rekeningBackup?: any;
	waktuPelunasan?: any;
	tagihan?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PembayaranService {
	private dataPembayaran: BehaviorSubject<Array<Pembayaran>> = new BehaviorSubject<Array<Pembayaran>>([]);
	dataPembayaran_ = this.dataPembayaran.asObservable();

	private dataHistori: BehaviorSubject<Array<Pembayaran>> = new BehaviorSubject<Array<Pembayaran>>([]);
	dataHistori_ = this.dataHistori.asObservable();
	
	private dataMenuggu: BehaviorSubject<Array<Pembayaran>> = new BehaviorSubject<Array<Pembayaran>>([]);
	dataMenuggu_ = this.dataMenuggu.asObservable();

	private dataBelum: BehaviorSubject<Array<Pembayaran>> = new BehaviorSubject<Array<Pembayaran>>([]);
	dataBelum_ = this.dataBelum.asObservable();

  constructor() {}

  setDataPembayaran(data: Array<Pembayaran>){ this.dataPembayaran.next(data) }
  getDataPembayaran(){ return this.dataPembayaran_ }
  getValuePembayaran(){ return this.dataPembayaran.getValue() };

  setDataHistori(data: Array<Pembayaran>){ this.dataHistori.next(data) }
  getDataHistori(){ return this.dataHistori_ }
  getValueHistori(){ return this.dataHistori.getValue() };

  setDataMenuggu(data: Array<Pembayaran>){ this.dataMenuggu.next(data) }
  getDataMenuggu(){ return this.dataMenuggu_ }
  getValueMenuggu(){ return this.dataMenuggu.getValue() };

  setDataBelum(data: Array<Pembayaran>){ this.dataBelum.next(data) }
  getDataBelum(){ return this.dataBelum_ }
  getValueBelum(){ return this.dataBelum.getValue() };
}
