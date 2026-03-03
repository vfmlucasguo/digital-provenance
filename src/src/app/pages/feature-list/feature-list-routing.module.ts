// @ai-generated
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureListPage } from './feature-list.page';

const routes: Routes = [{ path: '', component: FeatureListPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureListPageRoutingModule {}
