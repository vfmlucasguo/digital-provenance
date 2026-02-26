import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InlinePartialPage } from './inline-partial.page';

const routes: Routes = [{ path: '', component: InlinePartialPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InlinePartialPageRoutingModule {}
