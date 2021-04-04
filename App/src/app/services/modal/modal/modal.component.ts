import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit{
	@Input() jenis: string;
	@Input() header: string;
	@Input() data: any[];
  @Input() search: boolean = true;
  @Input() multiple: boolean = true;
  @Input() button: string[] = ['Batal', 'Pilih']

  form: FormGroup = new FormGroup({});

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(){
    if(!this.data) return;

    if(this.multiple){
      this.data.forEach(v => {
        this.form.addControl(v.id, new FormControl({
          value: this.jenis == 'select'? (v.checked? true : false) : this.jenis == 'photo' ? v.imgUrl : null, 
          disabled: v.disabled
        }))
      })
    }else{
      this.form.addControl('nonmultiple', new FormControl(null));
    }
  }

  dismiss(r){
  	this.modalCtrl.dismiss(this.form.value, r);
  }
}
