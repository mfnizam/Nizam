import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [{ path: '', component: PendaftaranPage }];


import { PendaftaranPage } from './Pendaftaran.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PendaftaranPage]
})
export class PendaftaranPageModule {}
