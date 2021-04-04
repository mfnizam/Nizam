import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
registerLocaleData(localeId);

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import { HttpClientModule } from '@angular/common/http';

import { PublicGuardService } from './services/guard/public-guard.service';
import { PemateriGuardService } from './services/guard/pemateri-guard.service';
import { AdminGuardService } from './services/guard/admin-guard.service';
import { AuthGuardService } from './services/guard/auth-guard.service';
import { AppComponent } from './app.component';



const routes: Routes = [
  {
    path: 'public',
    loadChildren: () => import('./pages/public/public.module').then(m => m.PublicPageModule),
    canActivate: [PublicGuardService]
  },
  {
    path: 'pemateri',
    loadChildren: () => import('./pages/pemateri/pemateri.module').then(m => m.PemateriPageModule),
    canActivate: [PemateriGuardService]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule),
    canActivate: [AdminGuardService]
  },
  {
    path: 'masuk',
    loadChildren: () => import('./pages/auth/masuk/masuk.module').then( m => m.MasukPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'daftar',
    loadChildren: () => import('./pages/auth/daftar/daftar.module').then( m => m.DaftarPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'public',
  }
];

// services
import { ServerService } from './services/server/server.service';
import { StorageService } from './services/storage/storage.service';
import { ModalService } from './services/modal/modal.service';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
  	BrowserModule, 
    // BrowserAnimationsModule,
  	IonicModule.forRoot(), 
  	RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'id-ID'},

    // -- services
    ServerService,
    StorageService,
    ModalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
