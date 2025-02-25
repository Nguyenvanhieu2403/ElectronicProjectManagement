import { Component, OnInit, Injector } from '@angular/core';
import { SecondPageIndexBase } from 'vnpost-shared';
import { AzRolePermissionsService } from '../../services/az-role-permissions.service';
import { AzPermissionsService } from '../../services/azpermissions.service';
import { AzRolesService } from '../../services/az-roles.service';
import { takeUntil, map } from 'rxjs/operators';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-azrole-permissions',
  templateUrl: './azrole-permissions.component.html',
  styleUrls: ['./azrole-permissions.component.scss']
})
export class AzRolePermissionsComponent extends SecondPageIndexBase implements OnInit {

  idAzRoleOriginal = 1;
  itemDetail: any = { title: '' };
  assigned = [];

  constructor(
    protected _azrolepermissionsService: AzRolePermissionsService,
    protected _azPermissionsService: AzPermissionsService,
    protected _azRolesService: AzRolesService,
    protected _injector: Injector,
    public app: AppComponent
  ) {
    super(_azrolepermissionsService, _injector);
  }

  async ngOnInit() {

    this.cols = [
      { field: 'permissionName', header: this._translateService.instant('FORM.TITLE'), visible: true, width: 'auto', align: 'left' },
      { field: 'permissionIndex', header: 'Index', visible: true, width: 'auto', align: 'left' },
    ];
    this._activatedRoute.params
      .pipe(map(params => params['id']), takeUntil(this._unsubscribeAll))
      .subscribe(async pid => {
        this.idAzRoleOriginal = pid;
        await this.getById();
        await this.getData();
      });
  }

  async getData() {
    this.isLoading = true;
    if (this.itemDetail !== undefined) {
      await this._azPermissionsService.getsAllByIdAzService(this.itemDetail.idAzService).then(rs => {
        if (rs.success) {
          this.dataSource = rs.data;
        }
      });

      await this._azPermissionsService.getsByIdAzRole(this.itemDetail.id).then(rs => {
        if (rs.success) {
          this.assigned = rs.data;
          this.totalRecord = rs.data.length;
        }
      });

      await this.dataSource.forEach(controller => {
        controller.azPermissionses.forEach(permission => {
          if (this.assigned.filter(x => x.id === permission.id).length > 0) {
            permission.checked = true;
          }
        });
      });
      this.isLoading = false;
    }
  }


  async getById() {
    await this._azRolesService.getById(this.idAzRoleOriginal).then(rs => {
      if (rs.success) {
        this.itemDetail = rs.data;
      }
    }, error => {
      this._notifierService.showWarning(this._translateService.instant('MESSAGE.NOT_FOUND_ERROR'));
    });
  }

  onChangeController(controller: any, event: any) {
    this._notifierService.showConfirm(this._translateService.instant('AzRolePermisssions.msgConfirm')).then(rs => {
      if (event.checked) {
        const permissions = controller.azPermissionses;
        for (const item of permissions) {
          this.onChangePermission(item, event.checked);
          item.checked = event.checked;
        }
      } else {
        // controller.checkedAll = !controller.checkedAll;
        const permissions = controller.azPermissionses;
        for (const item of permissions) {
          this.onChangePermission(item, event.checked);
          item.checked = event.checked;
        }
      }
    }).catch(err => {
      controller.checked = !controller.checked;
    });
  }

  onChangePermission(permission: any, isChecked: boolean) {
    permission.checked = isChecked;
  }
  back() {
    this._router.navigate([`/core/authorization/azroles`]);
  }
  async save() {
    this.isLoading = true;
    const dsAzPermission = [];
    await this.dataSource.forEach(controller => {
      controller.azPermissionses.forEach(permission => {
        if (permission.checked) {
          dsAzPermission.push(permission);
        }
      });
    });

    this._azrolepermissionsService.updatePermissionsByIdAzRole(dsAzPermission, this.itemDetail.id).then(rs => {
      if (rs.success) {
        this._notifierService.showUpdateDataSuccess();
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }
  cancel() {
    this.getData();
  }
}
