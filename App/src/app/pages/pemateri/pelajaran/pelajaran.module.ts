import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [{ path: '', component: PelajaranPage }];

import { PelajaranPage } from './pelajaran.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PelajaranPage]
})
export class PelajaranPageModule {}
