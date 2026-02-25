import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowTestDebouncePage } from './workflow-test-debounce.page';
import { WorkflowTestDebouncePageRoutingModule } from './workflow-test-debounce-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    WorkflowTestDebouncePageRoutingModule
  ],
  declarations: [WorkflowTestDebouncePage]
})
export class WorkflowTestDebouncePageModule {}
