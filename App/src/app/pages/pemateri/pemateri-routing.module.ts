import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PemateriPage } from './pemateri.page';

const routes: Routes = [
  {
    path: '',
    component: PemateriPage,
    children: [
      {
        path: 'beranda',
        loadChildren: () => import('./beranda/beranda.module').then(m => m.BerandaPageModule)
      },
      {
        path: 'pelajaran',
        loadChildren: () => import('./pelajaran/pelajaran.module').then(m => m.PelajaranPageModule)
      },
      {
        path: 'hasil',
        loadChildren: () => import('./hasil/hasil.module').then( m => m.HasilPageModule)
      },
      {
        path: 'akun',
        loadChildren: () => import('./akun/akun.module').then(m => m.AkunPageModule)
      },
      {
        path: '',
        redirectTo: 'pelajaran',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'pelatihan',
    loadChildren: () => import('./pelatihan/pelatihan.module').then( m => m.PelatihanPageModule)
  },
  {
    path: 'pelajaran/cu',
    loadChildren: () => import('./pelajaran/cu/cu.module').then( m => m.CuPageModule)
  },
  {
    path: 'pelajaran/detail',
    loadChildren: () => import('./pelajaran/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'akun/edit',
    loadChildren: () => import('./akun/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: '',
    redirectTo: 'pelajaran',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'pelajaran',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PemateriPageRoutingModule {}
