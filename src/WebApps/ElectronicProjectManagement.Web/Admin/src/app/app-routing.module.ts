import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppMainComponent } from './layouts/main-layout/app.main.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { AppModule } from './app.module';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { ReferencesFileManagerComponent } from './ElectronicProject/references-file-manager/references-file-manager.component';

export const routes: Routes = [
  {
    canActivate: [AuthGuardService],
    path: '',
    component: AppMainComponent,
    children: [
      {
        path: 'client-template',
        loadChildren: () =>
          import('./client-template/client-template.module').then(
            (m) => m.ClientTemplateModule
          ),
      },
      {
        path: 'core',
        loadChildren: () =>
          import('./core/core.module').then((m) => m.CoreModule),
      },
      { path: 'references-file-manager', component: ReferencesFileManagerComponent },
    ],
  },
  { path: 'error', component: AppErrorComponent },
  { path: 'access', component: AppAccessdeniedComponent },
  { path: 'notfound', component: AppNotfoundComponent },
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [{ path: '', component: AppLoginComponent }],
  },
  { path: '**', redirectTo: '/notfound' },
];
export const AppRoutes: ModuleWithProviders<AppModule> = RouterModule.forRoot(
  routes,
  { preloadingStrategy: QuicklinkStrategy }
);
