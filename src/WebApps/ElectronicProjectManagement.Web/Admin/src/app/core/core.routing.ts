import { Routes, RouterModule } from '@angular/router';
import { UsersListComponent } from './users/index/index.component';
import { SysMenusComponent } from './sys-menus/sys-menus.component';
import { AzServicesIndexComponent } from './authorization/azservices/index/index.component';
import { AzPermissionsIndexComponent } from './authorization/azpermissions/index/index.component';
import { AzRolesIndexComponent } from './authorization/azroles/index/index.component';
import { AzRolePermissionsComponent } from './authorization/azrole-permissions/azrole-permissions.component';
import { AzRoleMappingUsersIndexComponent } from './authorization/azrole-mapping-users/index/index.component';
import { UsersInfomationComponent } from './users/infomation/infomation.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        component: UsersListComponent,
      },
      {
        path: 'menus',
        component: SysMenusComponent,
      },
      {
        path: 'authorization',
        children: [
          { path: 'azservices', component: AzServicesIndexComponent },
          { path: 'azpermissions', component: AzPermissionsIndexComponent },
          { path: 'azroles', component: AzRolesIndexComponent },
          { path: 'azroles/haspermissions/:id', component: AzRolePermissionsComponent, },
          { path: 'mapping-users', component: AzRoleMappingUsersIndexComponent, },
        ]
      },
      {
        path: 'myprofile',
        component: UsersInfomationComponent,
      },
      {
        path: 'notifications',
        component: NotificationComponent
      },
    ]
  },
];

export const CoreRoutes = RouterModule.forChild(routes);
