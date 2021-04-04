import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ModalComponent } from './modal.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
  declarations: [ModalComponent]
})
export class ModalModule { }
