import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrTestValidatorPage } from './pr-test-validator.page';
import { PrTestValidatorPageRoutingModule } from './pr-test-validator-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PrTestValidatorPageRoutingModule
  ],
  declarations: [PrTestValidatorPage]
})
export class PrTestValidatorPageModule {}
