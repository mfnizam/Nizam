import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [{ path: '', component: CuPage }];

import { CuPage } from './cu.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CuPage]
})
export class CuPageModule {}
