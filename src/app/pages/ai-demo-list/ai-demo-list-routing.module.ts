import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiDemoListPage } from './ai-demo-list.page';

const routes: Routes = [
  { path: '', component: AiDemoListPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiDemoListPageRoutingModule {}
