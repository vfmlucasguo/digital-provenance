import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrTestUtilsPage } from './pr-test-utils.page';

const routes: Routes = [
  { path: '', component: PrTestUtilsPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrTestUtilsPageRoutingModule {}
