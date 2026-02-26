import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockPartialPage } from './block-partial.page';
import { BlockPartialPageRoutingModule } from './block-partial-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BlockPartialPageRoutingModule
  ],
  declarations: [BlockPartialPage]
})
export class BlockPartialPageModule {}
