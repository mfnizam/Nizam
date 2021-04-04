import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [{ path: '', component: PelatihanPage }];

import { PelatihanPage } from './pelatihan.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
		RouterModule.forChild(routes)
  ],
  declarations: [PelatihanPage]
})
export class PelatihanPageModule {}
