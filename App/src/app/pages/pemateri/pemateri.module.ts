import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PemateriPageRoutingModule } from './pemateri-routing.module';

import { PemateriPage } from './pemateri.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    PemateriPageRoutingModule
  ],
  declarations: [PemateriPage]
})
export class PemateriPageModule {}
