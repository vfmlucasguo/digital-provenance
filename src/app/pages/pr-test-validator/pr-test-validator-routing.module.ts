import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrTestValidatorPage } from './pr-test-validator.page';

const routes: Routes = [
  { path: '', component: PrTestValidatorPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrTestValidatorPageRoutingModule {}
