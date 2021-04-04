import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicPage } from './public.page';

const routes: Routes = [
  {
    path: '',
    component: PublicPage,
    children: [
      {
        path: 'beranda',
        loadChildren: () => import('./beranda/beranda.module').then(m => m.BerandaPageModule)
      },
      {
        path: 'pelatihan',
        loadChildren: () => import('./pelatihan/pelatihan.module').then( m => m.PelatihanPageModule)
      },
      {
        path: 'aktifitas',
        loadChildren: () => import('./aktifitas/aktifitas.module').then(m => m.AktifitasPageModule)
      },
      {
        path: 'akun',
        loadChildren: () => import('./akun/akun.module').then(m => m.AkunPageModule)
      },
      {
        path: '',
        redirectTo: 'beranda',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'akun/edit',
    loadChildren: () => import('./akun/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: '',
    redirectTo: 'beranda',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'beranda',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPageRoutingModule {}
