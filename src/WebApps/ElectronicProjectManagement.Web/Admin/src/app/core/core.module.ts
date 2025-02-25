import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutes } from './core.routing';
import { VnPostSharedModule } from 'vnpost-shared';
import { ClickOutsideModule } from 'ng-click-outside';
import { UsersListComponent } from './users/index/index.component';
import { UsersAddComponent } from './users/add/add.component';
import { UsersEditComponent } from './users/edit/edit.component';
import { SysMenusComponent } from './sys-menus/sys-menus.component';
import { AzServicesIndexComponent } from './authorization/azservices/index/index.component';
import { AzServicesFormComponent } from './authorization/azservices/form/form.component';
import { AzPermissionsIndexComponent } from './authorization/azpermissions/index/index.component';
import { AzPermissionsFormComponent } from './authorization/azpermissions/form/form.component';
import { AzPermissionsImportComponent } from './authorization/azpermissions/import/import.component';
import { AzRolesIndexComponent } from './authorization/azroles/index/index.component';
import { AzRolesFormComponent } from './authorization/azroles/form/form.component';
import { AzRolePermissionsComponent } from './authorization/azrole-permissions/azrole-permissions.component';
import { AzRoleMappingUsersIndexComponent } from './authorization/azrole-mapping-users/index/index.component';
import { AzRoleMappingUsersFormComponent } from './authorization/azrole-mapping-users/form/form.component';
import { UsersInfomationComponent } from './users/infomation/infomation.component';
import { UsersResetpasswdComponent } from './users/resetpasswd/resetpasswd.component';
import { UsersImportComponent } from './users/import/import.component';
import { NotificationComponent } from './notification/notification.component';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutes,
    VnPostSharedModule.forRoot({ environment: environment }),
    ClickOutsideModule,
  ],
  declarations: [
    UsersListComponent,
    UsersAddComponent,
    UsersEditComponent,
    SysMenusComponent,
    AzServicesIndexComponent,
    AzServicesFormComponent,
    AzPermissionsIndexComponent,
    AzPermissionsFormComponent,
    AzPermissionsImportComponent,
    AzRolesIndexComponent,
    AzRolesFormComponent,
    AzRolePermissionsComponent,
    AzRoleMappingUsersIndexComponent,
    AzRoleMappingUsersFormComponent,
    UsersInfomationComponent,
    UsersResetpasswdComponent,
    UsersImportComponent,
    NotificationComponent,

  ]
})
export class CoreModule { }
