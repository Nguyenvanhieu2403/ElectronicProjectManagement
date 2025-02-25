import { Component, OnInit, Injector } from '@angular/core';
import { SecondPageEditBase, UserService } from 'vnpost-shared';
import { AzRoleMappingUsersService } from '../../../services/az-role-mapping-users.service';
import { AzRolesService } from '../../../services/az-roles.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-azrolemappingusers-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AzRoleMappingUsersFormComponent extends SecondPageEditBase implements OnInit {

  dsAzRoles = [];
  arrAzRoles = [];
  dsUsers = [];
  dsAzRoleAdded = [];
  userId = 0;
  cols = [];
  constructor(
    protected _azRoleMappingUsersService: AzRoleMappingUsersService,
    protected _userService: UserService,
    protected _azRolesService: AzRolesService,
    protected _injector: Injector,
  ) {
    super(_azRoleMappingUsersService, _injector);

    this.formGroup = new UntypedFormGroup({
      userId: new UntypedFormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    this.cols = [
      { field: 'titleAzRole', header: this._translateService.instant('AzRoleMappingUsers.TitleAzRole'), visible: true, align: 'left', },
      // { field: 'codeAzRole', header: this._translateService.instant('AzRoleMappingUsers_codeAzRole'), visible: true, align: 'left', },
    ];
  }

  async onShowPopup(data: any) {
    this.submitting = true;
    if (this.dsUsers.length === 0) {
      await this.loadUsers();
    }
    if (this.dsAzRoles.length === 0) {
      await this.loadVaiTro();
    }
    this.validationSummary.resetErrorMessages();
    if (data.itemId > 0) {
      this.userId = data.itemId;
      this.onChangeNguoiDung();
    } else {
      this.userId = 0;
      this.dsAzRoleAdded = [];
    }
    this.submitting = false;
  }

  async loadUsers() {
    var model = {
      keyword: '',
      status: 1,
      pageIndex: 1,
      pageSize: 999999,
      orderCol: 'userName',
      isDesc: false,
      unitCode: this.currentUser.unitCode
    }
    await this._userService.find(model).then(rs => {
      if (rs.success) {
        this.dsUsers = rs.data.map(item => ({ label: item.userName + '.(' + item.displayName + ')', value: item.id }));
      }
    });
  }
  async loadVaiTro() {
    this.dsAzRoles = [];
    var model = {
      keyword: '',
      status: 1,
      pageIndex: 1,
      pageSize: 999999,
      orderCol: 'Title',
      isDesc: false,
      idAzService: 0,
      unitCode: this.currentUser.unitCode
    }
    await this._azRoleMappingUsersService.findRole(model).then(rs => {
      if (rs.success) {
        this.arrAzRoles = rs.data;
        rs.data.map(item =>
          this.dsAzRoles.push({ label: item.title + '.(' + item.code + ')', value: item.id })
        );
        //this.convertDataToOptions(this.dsAzRoles, rs.data, 'title');
      }
    });
  }

  onAddRole() {
    const newItem = {
      isEdit: true,
      idAzRole: null,
      titleAzRole: '',
      codeAzRole: ''
    };
    if (this.dsAzRoleAdded === undefined) {
      this.dsAzRoleAdded = [newItem];
    } else {
      this.dsAzRoleAdded.push(newItem);
    }
  }

  onCancelRole(item) {
    if (item) {
      item.isEdit = !item.isEdit;
    }
  }

  onEditRole(item) {
    item.isEdit = !item.isEdit;
  }

  onDeleteRole(item) {
    this._notifierService.showDeleteConfirm().then(rs => {
      const index: number = this.dsAzRoleAdded.indexOf(item);
      if (index !== -1) {
        this.dsAzRoleAdded.splice(index, 1);
        this._notifierService.showDeleteDataSuccess();
      }

    });
  }
  onChangeRole(item) {
    const perInfo = this.arrAzRoles.filter(x => x.id === item.idAzRole)[0];
    if (perInfo) {
      item.titleAzRole = perInfo.code;
      item.codeAzRole = perInfo.title;
    }
  }
  onChangeNguoiDung() {
    this.submitting = true;
    this._azRoleMappingUsersService.getsByUserId(this.userId).then(rs => {
      if (rs.success) {
        this.dsAzRoleAdded = rs.data;
      }
      this.submitting = false;
    });
  }

  save() {
    this.submitting = true;

    if (this.userId <= 0 || this.userId === undefined) {
      this._notifierService.showWarning(this._translateService.instant('AzRoleMappingUsers.Error'));
      this.submitting = false;
      return;
    }

    const dsIdAzRole = [];
    this.dsAzRoleAdded.map(item =>
      dsIdAzRole.push(item.idAzRole)
    );

    this._azRoleMappingUsersService.updateByUserId(this.userId, dsIdAzRole).then(rs => {
      if (rs.success) {
        this._notifierService.showUpdateDataSuccess();
        this.closePopupMethod(true);
      }
    });
  }

}

