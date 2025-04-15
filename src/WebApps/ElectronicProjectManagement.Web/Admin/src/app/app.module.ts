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
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReferencesFileManagerComponent } from './ElectronicProject/references-file-manager/references-file-manager.component';
import { AddReferencesFileManagerComponent } from './ElectronicProject/references-file-manager/add-references-file-manager/add-references-file-manager.component';
import { EditReferencesFileManagerComponent } from './ElectronicProject/references-file-manager/edit-references-file-manager/edit-references-file-manager.component';
import { TopicManagerComponent } from './ElectronicProject/general-categories/topic-manager/topic-manager.component';
import { AddTopicManagerComponent } from './ElectronicProject/general-categories/topic-manager/add-topic-manager/add-topic-manager.component';
import { EditTopicManagerComponent } from './ElectronicProject/general-categories/topic-manager/edit-topic-manager/edit-topic-manager.component';
import { ProjectBatchComponent } from './ElectronicProject/general-categories/project-batch/project-batch.component';
import { AddProjectBatchComponent } from './ElectronicProject/general-categories/project-batch/add-project-batch/add-project-batch.component';
import { EditProjectBatchComponent } from './ElectronicProject/general-categories/project-batch/edit-project-batch/edit-project-batch.component';
import { ViewProjectBatchComponent } from './ElectronicProject/general-categories/project-batch/view-project-batch/view-project-batch.component';
import { RegisterForInstructorsComponent } from './ElectronicProject/register-for-instructors/register-for-instructors.component';
import { ViewRegisterForInstructorsComponent } from './ElectronicProject/register-for-instructors/view-register-for-instructors/view-register-for-instructors.component';
import { AddStudentRegisterProjectComponent } from './ElectronicProject/student-register-project/add-student-register-project/add-student-register-project.component';
import { StudentRegisterProjectComponent } from './ElectronicProject/student-register-project/student-register-project.component';
import { EditProjectManagerComponent } from './ElectronicProject/general-categories/project-manager/edit-project-manager/edit-project-manager.component';
import { AddProjectManagerComponent } from './ElectronicProject/general-categories/project-manager/add-project-manager/add-project-manager.component';
import { ProjectManagerComponent } from './ElectronicProject/general-categories/project-manager/project-manager.component';
import { ImportProjectManagerComponent } from './ElectronicProject/general-categories/project-manager/import-project-manager/import-project-manager.component';
import { TopicApprovalComponent } from './ElectronicProject/topic-approval/topic-approval.component';
import { PersonalProjectManagementComponent } from './ElectronicProject/personal-project-management/personal-project-management.component';
import { AddPersonalProjectManagementComponent } from './ElectronicProject/personal-project-management/add-personal-project-management/add-personal-project-management.component';
import { ViewPersonalProjectManagementComponent } from './ElectronicProject/personal-project-management/view-personal-project-management/view-personal-project-management.component';
import { ProjectApprovalComponent } from './ElectronicProject/project-approval/project-approval.component';
import { ThesisDefenceComponent } from './ElectronicProject/thesis-defence/thesis-defence.component';
import { AddThesisDefenceComponent } from './ElectronicProject/thesis-defence/add-thesis-defence/add-thesis-defence.component';
import { CommentThesisDefenceComponent } from './ElectronicProject/thesis-defence/comment-thesis-defence/comment-thesis-defence.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';

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
    PdfViewerModule,
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
    DashboardComponent,
    ChatBoxComponent,
    ReferencesFileManagerComponent,
    AddReferencesFileManagerComponent,
    EditReferencesFileManagerComponent,
    TopicManagerComponent,
    AddTopicManagerComponent,
    EditTopicManagerComponent,
    ProjectBatchComponent,
    AddProjectBatchComponent,
    EditProjectBatchComponent,
    ViewProjectBatchComponent,
    RegisterForInstructorsComponent,
    ViewRegisterForInstructorsComponent,
    StudentRegisterProjectComponent,
    AddStudentRegisterProjectComponent,
    ProjectManagerComponent,
    AddProjectManagerComponent,
    EditProjectManagerComponent,
    ImportProjectManagerComponent,
    TopicApprovalComponent,
    PersonalProjectManagementComponent,
    AddPersonalProjectManagementComponent,
    ViewPersonalProjectManagementComponent,
    ProjectApprovalComponent,
    ThesisDefenceComponent,
    AddThesisDefenceComponent,
    CommentThesisDefenceComponent,
      ChatBoxComponent
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
