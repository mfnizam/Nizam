import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';


export class User {
	_id: string;
	namaLengkap: string;
	email: string;
	noKta?: string;
	kwarcab?: string;
	noTlp?: string;
	alamat?: string;
	tglLahir?: string;
	jenisKelamin?: number;
	imgUrl?: string;
	isAdmin?: boolean;
	status: number;
	pilihan?: {
		penilaian?: Boolean;
		soal: string;
		pilihan: string;
	}[];
	penilaian?: number;
}

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private dataUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);
	dataUser_ = this.dataUser.asObservable();

	constructor() { }

	setDataUser(data: User){ this.dataUser.next(data) }
  getDataUser(){ return this.dataUser_ }
  getValueUser(){ return this.dataUser.getValue() };
}
