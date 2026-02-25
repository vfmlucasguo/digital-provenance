import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowTestFetchPage } from './workflow-test-fetch.page';

const routes: Routes = [
  { path: '', component: WorkflowTestFetchPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowTestFetchPageRoutingModule {}
