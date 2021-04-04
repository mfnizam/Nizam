import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPage } from './admin.page';

import { AdminGuardService } from '../../services/guard/admin-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'beranda',
        loadChildren: () => import('./beranda/beranda.module').then(m => m.BerandaPageModule),
        canActivate: [AdminGuardService]
      },
      {
        path: 'pelatihan',
        loadChildren: () => import('./pelatihan/pelatihan.module').then( m => m.PelatihanPageModule),
        canActivate: [AdminGuardService]
      },
      {
        path: 'pendaftaran',
        loadChildren: () => import('./pendaftaran/pendaftaran.module').then( m => m.PendaftaranPageModule)
      },
      {
        path: 'master',
        loadChildren: () => import('./master/master.module').then( m => m.MasterPageModule),
        canActivate: [AdminGuardService]
      },
      {
        path: 'akun',
        loadChildren: () => import('./akun/akun.module').then(m => m.AkunPageModule),
        canActivate: [AdminGuardService]
      },
      {
        path: '',
        redirectTo: 'pelatihan',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'master/data',
    loadChildren: () => import('./master/data/data.module').then( m => m.DataPageModule),
    canActivate: [AdminGuardService]
  },
  {
    path: 'master/cu',
    loadChildren: () => import('./master/cu/cu.module').then( m => m.CuPageModule)
  },
  {
    path: 'master/detail',
    loadChildren: () => import('./master/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'pelatihan/cu',
    loadChildren: () => import('./pelatihan/cu/cu.module').then( m => m.CuPageModule)
  },
  {
    path: 'pelatihan/detail',
    loadChildren: () => import('./pelatihan/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'akun/edit',
    loadChildren: () => import('./akun/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: '',
    redirectTo: 'pelatihan',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'pelatihan',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
