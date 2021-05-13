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
        redirectTo: 'aktifitas',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'akun/edit',
    loadChildren: () => import('./akun/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'pelatihan/pilih',
    loadChildren: () => import('./pelatihan/pilih/pilih.module').then( m => m.PilihPageModule)
  },
  {
    path: 'aktifitas/detail',
    loadChildren: () => import('./aktifitas/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'aktifitas/soal',
    loadChildren: () => import('./aktifitas/soal/soal.module').then( m => m.SoalPageModule)
  },
  {
    path: '',
    redirectTo: 'aktifitas',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'aktifitas',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPageRoutingModule {}
