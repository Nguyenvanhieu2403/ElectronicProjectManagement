import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { SecondPageIndexBase, UserService } from 'vnpost-shared';
import { UsersAddComponent } from '../add/add.component';
import { AppComponent } from '../../../app.component';
import { UsersEditComponent } from '../edit/edit.component';
import { UsersResetpasswdComponent } from '../resetpasswd/resetpasswd.component';
import { UsersImportComponent } from '../import/import.component';
import { UnitService } from '../../services/unit-service';
import { UserTypeId } from '../../../config/enums';

@Component({
  selector: 'app-users-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class UsersListComponent extends SecondPageIndexBase implements OnInit {

  @ViewChild('pCreate', { static: false }) pCreate: UsersAddComponent;
  @ViewChild('pEdit', { static: false }) pEdit: UsersEditComponent;
  @ViewChild('pRestorePasswd', { static: false }) pRestorePasswd: UsersResetpasswdComponent;
  @ViewChild('pImport') pImport: UsersImportComponent;

  unitCode = this.currentUser?.unitCode;
  listUnit: { label: string; value: string }[] = [];

  constructor(
    protected _injector: Injector,
    protected _userService: UserService,
    public app: AppComponent,
    private _unitService: UnitService,
  ) {
    super(_userService, _injector);
  }

  ngOnInit() {
    this.loadTableColumnConfig();
    this.getListUnit();
    this.getData();
    this.resetBulkSelect();
  }

  loadTableColumnConfig() {
    this.cols = [
      { field: 'userName', header: 'Tên đăng nhập', visible: true, sort: true },
      { field: 'displayName', header: 'Họ và tên', visible: true, sort: true },
      { field: 'email', header: 'Email', visible: true, sort: true },
      { field: 'unitCode', header: 'Đơn vị', visible: true, },
    ];
  }

  getListUnit() {
    this._unitService.getTreeUnitByUnitCode(this.currentUser?.unitCode).then((rs) => {
      if (rs.success) {
        this.listUnit = rs?.data
          ?.map((r) => ({
            label: `- ${r.unitName} (${r.unitCode})`,
            value: r.unitCode,
          }));
      } else {
        this.listUnit = [];
      }
    });
  }

  async getData() {
    this.isLoading = true;
    var model = {
      keyword: this.query,
      status: this.status,
      unitCode: this.unitCode,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      orderCol: this.orderCol,
      isDesc: this.isDesc,
      typeId: UserTypeId.User
    }
    await this._userService.find(model)
      .then(response => {
        this.dataSource = response.data;
        this.totalRecord = response.totalRecord;
        this.dataExport = response.data;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        this._notifierService.showHttpUnknowError();
      });

    this.resetBulkSelect();
  }

  edit() {
    const item = this.selectedItems[0];
    this.pEdit.showPopup(item.id);
  }

  add() {
    this.pCreate.showPopup();
  }

  restorePasswd() {
    const item = this.selectedItems[0];
    this.pRestorePasswd.showPopup(item.id);
  }

  onImport() {
    this.pImport.showPopup();
  }
}
