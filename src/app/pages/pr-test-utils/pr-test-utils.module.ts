import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrTestUtilsPage } from './pr-test-utils.page';
import { PrTestUtilsPageRoutingModule } from './pr-test-utils-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PrTestUtilsPageRoutingModule
  ],
  declarations: [PrTestUtilsPage]
})
export class PrTestUtilsPageModule {}
