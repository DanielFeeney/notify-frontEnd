import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'registrar',
        loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpModule)
      },
      {
        path: 'reset-password',
        loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
      }

    ]
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
