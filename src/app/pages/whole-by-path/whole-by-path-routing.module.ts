import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WholeByPathPage } from './whole-by-path.page';

const routes: Routes = [
  { path: '', component: WholeByPathPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WholeByPathPageRoutingModule {}
