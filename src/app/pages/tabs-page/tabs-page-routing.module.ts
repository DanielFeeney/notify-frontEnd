import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
import { SchedulePage } from '../schedule/schedule';
import { UsuariosPage } from '../usuarios/usuarios';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'schedule',
        children: [
          {
            path: '',
            component: SchedulePage,
          },
          {
            path: 'publicacao/:publicacaoId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          }
        ]
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            component: UsuariosPage,
          },
          {
            path: 'usuario',
            loadChildren: () => import('../usuarios-detail/usuario-detail.module').then(m => m.UsuarioDetailModule)
          },
          {
            path: 'usuario/:usuarioId',
            loadChildren: () => import('../usuarios-detail/usuario-detail.module').then(m => m.UsuarioDetailModule)
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
          }
        ]
      },
      {
        path: 'tags',
        children: [
          {
            path: '',
            loadChildren: () => import('../tags/tags.module').then(m => m.TagsModule)
          },
          {
            path: 'tag',
            loadChildren: () => import('../create-tag/create-tag.module').then(m => m.CreateTagModule)
          },
          {
            path: 'tag/:tagId',
            loadChildren: () => import('../create-tag/create-tag.module').then(m => m.CreateTagModule)
          }
        ]
      },
      {
        path: 'filtros',
        children: [
          {
            path: '',
            loadChildren: () => import('../filtros/filtros.module').then(m => m.FiltrosModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/schedule',
        pathMatch: 'full'
      },
      {
        path: 'criar',
        children: [
          {
            path: '',
            loadChildren: () => import('../create-publicacao/createPublicacao.module').then(m => m.CreatePublicacaoModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule)
          },
          {
            path: 'password',
            loadChildren: () => import('../password/password.module').then(m => m.PasswordModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

