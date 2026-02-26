import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InlinePartialPage } from './inline-partial.page';
import { InlinePartialPageRoutingModule } from './inline-partial-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    InlinePartialPageRoutingModule
  ],
  declarations: [InlinePartialPage]
})
export class InlinePartialPageModule {}
