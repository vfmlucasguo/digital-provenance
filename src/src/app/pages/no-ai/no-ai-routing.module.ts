import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAiPage } from './no-ai.page';

const routes: Routes = [{ path: '', component: NoAiPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoAiPageRoutingModule {}
