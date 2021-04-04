import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { Tingkatan } from '../master/master.service';
import { User } from '../user/user.service';

export class Pelatihan{
	_id: string;
	kode: string;
	nama: string;
	tingkatan: Tingkatan;
	tglPendaftaranMulai: Date;
	tglPendaftaranAkhir: Date;
	tglPelaksanaanMulai: Date;
	tglPelaksanaanAkhir: Date;
	imgUrl: string; // for logo
	deskripsi: string;
	biaya: number;
	pemateri: User[];
	pelajaran: Pelajaran[];
	status: number;
}

export class Pelajaran{
	_id: string;
	nama: string;
	pelatihan: Pelatihan;
	materi: Materi[];
	hide: boolean;
}

export class Materi{
	_id: string;
	// tingkatan: Tingkatan;
	pelajaran: string;
	jenis: number; // 1 pretest, 2 post test, 3 remidi pros test, materi
	kunciJawaban: any; // need expain more
	tglPelaksanaan: Date;
	waktuPelaksanaanMulai: Date;
	waktuPelaksanaanAkhir: Date;
	durasiPelaksanaan: number; // dalam satuan waktu menit,
	soal: {
		_id: string,
		deskripsi: string,
		jawaban: {
			_id: string,
			deskripsi: string
		}[],
		pilihan: string
	}[]
}

@Injectable({
	providedIn: 'root'
})
export class PelatihanService {
	private dataPelatihan: BehaviorSubject<Array<Pelatihan>> = new BehaviorSubject<Array<Pelatihan>>([]);
	dataPelatihan_ = this.dataPelatihan.asObservable();

	private dataPelatihanAktif: BehaviorSubject<Pelatihan> = new BehaviorSubject<Pelatihan>(null);
	dataPelatihanAktif_ = this.dataPelatihanAktif.asObservable();

	private dataPelajaran: BehaviorSubject<Array<Pelajaran>> = new BehaviorSubject<Array<Pelajaran>>([]);
	dataPelajaran_ = this.dataPelajaran.asObservable();

	private dataMateri: BehaviorSubject<Array<Materi>> = new BehaviorSubject<Array<Materi>>([]);
	dataMateri_ = this.dataMateri.asObservable();

	public jenisMateri = [{title: '', jenis: ''}, {title: 'Pre Test', jenis: 'Soal'}, {title: 'Post Test', jenis: 'Soal'}, {title: 'Re-Post Test', jenis: 'Soal'}, {title: 'Materi', jenis: 'Materi'}, {title: 'Lain', jenis: 'Lain-lain'}];

	constructor() { }

	setDataPelatihan(data: Array<Pelatihan>){ this.dataPelatihan.next(data) }
	getDataPelatihan(){ return this.dataPelatihan_ }
	getValuePelatihan(){ return this.dataPelatihan.getValue() };

	setDataPelatihanAktif(data: Pelatihan){ this.dataPelatihanAktif.next(data) }
	getDataPelatihanAktif(){ return this.dataPelatihanAktif_ }
	getValuePelatihanAktif(){ return this.dataPelatihanAktif.getValue() };

	setDataPelajaran(data: Array<Pelajaran>){ this.dataPelajaran.next(data) }
	getDataPelajaran(){ return this.dataPelajaran_ }
	getValuePelajaran(){ return this.dataPelajaran.getValue() };

	setDataMateri(data: Array<Materi>){ this.dataMateri.next(data) }
	getDataMateri(){ return this.dataMateri_ }
	getValueMateri(){ return this.dataMateri.getValue() };
}
