import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { SecondPageIndexBase } from 'vnpost-shared';
import { AzPermissionsFormComponent } from '../form/form.component';
import { AzPermissionsImportComponent } from '../import/import.component';
import { AzPermissionsService } from '../../../services/azpermissions.service';
import { AzServicesService } from '../../../services/azservices.service';
import { AzControllersService } from '../../../services/azcontrollers.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-azpermissions-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class AzPermissionsIndexComponent extends SecondPageIndexBase implements OnInit {

  popupSize: any = { width: '1170' };
  @ViewChild('pEdit') pEdit: AzPermissionsFormComponent;
  @ViewChild('pImport') pImport: AzPermissionsImportComponent;
  dsServices = [];
  idService = 0;
  dsControllers = [];
  idController = 0;
  constructor(
    protected _permissionsService: AzPermissionsService,
    protected _injector: Injector,
    protected _servicesService: AzServicesService,
    protected _controllersService: AzControllersService,
    public app: AppComponent
  ) {
    super(_permissionsService, _injector);
  }

  async ngOnInit() {

    this.cols = [
      { field: 'titleAzController', header: this._translateService.instant('AzPermissions.TitleAzController'), visible: true, width: 'auto', align: 'left', sort: true, },
      { field: 'permissionName', header: this._translateService.instant('FORM.TITLE'), visible: true, width: 'auto', align: 'left', sort: true, },
      { field: 'permissionIndex', header: this._translateService.instant('AzPermissions.permissionIndex'), visible: true, width: 'auto', align: 'left' },
      { field: 'modified', header: this._translateService.instant('TABLEDATA.MODIFIED'), visible: false, width: 'auto', sort: true, dateFormat: 'dd/MM/yyyy HH:mm' },
      { field: 'modifiedByName', header: this._translateService.instant('TABLEDATA.MODIFIED_BY'), visible: false, width: 'auto' },
    ];
    this.loadServices();
    this.loadControllersByService();
    this.getData();
  }

  loadServices() {
    this.dsServices = [{ label: this._translateService.instant('AzPermissions.dsIdAzService'), value: 0 }];
    var model = {
      keyword: '',
      status: 1,
      pageIndex: 1,
      pageSize: 999999,
      orderColl: '',
      isDesc: true
    };
    this._servicesService.getsBySearch(model).then(rs => {
      if (rs.success) {
        this.convertDataToOptions(this.dsServices, rs.data, 'title');
      }
    });
  }

  loadControllersByService() {
    this.dsControllers = [{ label: this._translateService.instant('AzPermissions.dsIdAzController'), value: 0 }];
    this._controllersService.getsByIdService(this.idService).then(rs => {
      if (rs.success) {
        this.convertDataToOptions(this.dsControllers, rs.data, 'title');
      }
    });
  }

  getData(limit?: number) {
    this.resetBulkSelect();
    this.isLoading = true;
    var model = {
      keyword: this.query,
      status: this.status,
      idService: this.idService,
      idController: this.idController,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      orderCol: this.orderCol,
      isDesc: this.isDesc
    }
    this._permissionsService.find(model)
      .then(response => {
        this.dataSource = response.data;
        this.dataExport = response.data;
        if (response.totalRecord || response.totalRecord === 0) {
          this.totalRecord = response.totalRecord;
        }
        this.afterGetData();
        this.isLoading = false;
      }, error => {
        this._notifierService.showHttpUnknowError();
        this.isLoading = false;
      });
  }

  edit() {
    const item = this.selectedItems[0];
    this.pEdit.showPopup(item.id);
  }

  add() {
    this.pEdit.showPopup();
  }
  import() {
    this.pImport.showPopup(this.idService);
  }
}
