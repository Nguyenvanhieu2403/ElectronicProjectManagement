import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppCodeModule } from './layouts/main-layout/app.code.component';
import { AppComponent } from './app.component';
import { AppMainComponent } from './layouts/main-layout/app.main.component';
import { AppConfigComponent } from './layouts/main-layout/app.config.component';
import { AppMenuComponent } from './layouts/main-layout/app.menu.component';
import { AppMenuitemComponent } from './layouts/main-layout/app.menuitem.component';
import { AppInlineMenuComponent } from './layouts/main-layout/app.inlinemenu.component';
import { AppTopBarComponent } from './layouts/main-layout/app.topbar.component';
import { AppFooterComponent } from './layouts/main-layout/app.footer.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { MenuService } from './layouts/main-layout/app.menu.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';
import {
  VnPostSharedModule,
  MultiTranslateHttpLoader,
  SendAccessTokenInterceptor,
} from 'vnpost-shared';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppRoutes } from './app-routing.module';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { DragDropModule } from 'primeng/dragdrop';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { QuicklinkModule } from 'ngx-quicklink';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { ReferencesFileManagerComponent } from './ElectronicProject/references-file-manager/references-file-manager.component';
import { AddReferencesFileManagerComponent } from './ElectronicProject/references-file-manager/add-references-file-manager/add-references-file-manager.component';
import { EditReferencesFileManagerComponent } from './ElectronicProject/references-file-manager/edit-references-file-manager/edit-references-file-manager.component';
export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    CalendarModule,
    InputGroupModule,
    InputGroupAddonModule,
    FormsModule,
    TreeSelectModule,
    AppRoutes,
    HttpClientModule,
    BrowserAnimationsModule,
    AppCodeModule,
    VnPostSharedModule.forRoot({ environment: environment }),
    ClickOutsideModule,
    ToastModule,
    TranslateModule.forRoot({
      defaultLanguage: 'vi',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.apiDomain.gateway],
        sendAccessToken: false,
      },
    }),
    DragDropModule,
    QuicklinkModule,
    ToastModule,
    MultiSelectModule,
    InputTextareaModule,
    InputSwitchModule,
    ChartModule,
  ],
  declarations: [
    AppComponent,
    AppMainComponent,
    AppConfigComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppInlineMenuComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppLoginComponent,
    AppNotfoundComponent,
    AppErrorComponent,
    AppAccessdeniedComponent,
    LoginLayoutComponent,
    ReferencesFileManagerComponent,
    AddReferencesFileManagerComponent,
    EditReferencesFileManagerComponent,
  ],
  providers: [
    MenuService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SendAccessTokenInterceptor,
      multi: true,
    },
    MessageService,
    ConfirmationService,
    AuthGuardService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
