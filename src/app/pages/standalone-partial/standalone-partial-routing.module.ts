import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandalonePartialPage } from './standalone-partial.page';

const routes: Routes = [
  { path: '', component: StandalonePartialPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandalonePartialPageRoutingModule {}
