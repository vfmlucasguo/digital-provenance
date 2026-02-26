import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiDemoListPage } from './ai-demo-list.page';
import { AiDemoListPageRoutingModule } from './ai-demo-list-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AiDemoListPageRoutingModule
  ],
  declarations: [AiDemoListPage]
})
export class AiDemoListPageModule {}
