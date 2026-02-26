import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockPartialPage } from './block-partial.page';

const routes: Routes = [{ path: '', component: BlockPartialPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockPartialPageRoutingModule {}
