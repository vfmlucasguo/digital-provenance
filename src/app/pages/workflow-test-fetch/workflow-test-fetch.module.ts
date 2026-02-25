import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowTestFetchPage } from './workflow-test-fetch.page';
import { WorkflowTestFetchPageRoutingModule } from './workflow-test-fetch-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    WorkflowTestFetchPageRoutingModule
  ],
  declarations: [WorkflowTestFetchPage]
})
export class WorkflowTestFetchPageModule {}
