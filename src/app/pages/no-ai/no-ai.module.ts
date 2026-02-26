import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoAiPage } from './no-ai.page';
import { NoAiPageRoutingModule } from './no-ai-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NoAiPageRoutingModule
  ],
  declarations: [NoAiPage]
})
export class NoAiPageModule {}
