import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WholeByPathPage } from './whole-by-path.page';
import { WholeByPathPageRoutingModule } from './whole-by-path-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    WholeByPathPageRoutingModule
  ],
  declarations: [WholeByPathPage]
})
export class WholeByPathPageModule {}
