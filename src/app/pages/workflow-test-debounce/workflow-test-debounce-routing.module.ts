import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowTestDebouncePage } from './workflow-test-debounce.page';

const routes: Routes = [
  { path: '', component: WorkflowTestDebouncePage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowTestDebouncePageRoutingModule {}
