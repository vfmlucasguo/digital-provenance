import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderWholePage } from './header-whole.page';
import { HeaderWholePageRoutingModule } from './header-whole-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HeaderWholePageRoutingModule
  ],
  declarations: [HeaderWholePage]
})
export class HeaderWholePageModule {}
