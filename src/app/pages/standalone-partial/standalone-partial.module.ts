import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StandalonePartialPage } from './standalone-partial.page';
import { StandalonePartialPageRoutingModule } from './standalone-partial-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    StandalonePartialPageRoutingModule
  ],
  declarations: [StandalonePartialPage]
})
export class StandalonePartialPageModule {}
