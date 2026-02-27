import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'ai-demo',
        loadChildren: () => import('../pages/ai-demo-list/ai-demo-list.module').then(m => m.AiDemoListPageModule)
      },
      {
        path: 'whole-by-path',
        loadChildren: () => import('../pages/whole-by-path/whole-by-path.module').then(m => m.WholeByPathPageModule)
      },
      {
        path: 'header-whole',
        loadChildren: () => import('../pages/header-whole/header-whole.module').then(m => m.HeaderWholePageModule)
      },
      {
        path: 'block-partial',
        loadChildren: () => import('../pages/block-partial/block-partial.module').then(m => m.BlockPartialPageModule)
      },
      {
        path: 'inline-partial',
        loadChildren: () => import('../pages/inline-partial/inline-partial.module').then(m => m.InlinePartialPageModule)
      },
      {
        path: 'no-ai',
        loadChildren: () => import('../pages/no-ai/no-ai.module').then(m => m.NoAiPageModule)
      },
      // @ai-generated-begin
      {
        path: 'login',
        loadChildren: () => import('../pages/login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsPageModule)
      },
      // @ai-generated-end
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
