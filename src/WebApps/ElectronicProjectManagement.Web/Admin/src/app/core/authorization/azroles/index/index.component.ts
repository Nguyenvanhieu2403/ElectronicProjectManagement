import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { SecondPageIndexBase } from 'vnpost-shared';
import { AzRolesFormComponent } from '../form/form.component';
import { AzRolesService } from '../../../services/az-roles.service';
import { AzServicesService } from '../../../services/azservices.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class AzRolesIndexComponent extends SecondPageIndexBase implements OnInit {

  @ViewChild('pEdit') pEdit: AzRolesFormComponent;
  idAzService = 0;
  dsAzService = [];

  constructor(
    protected _azrolesService: AzRolesService,
    protected _injector: Injector,
    protected _servicesService: AzServicesService,
    public app: AppComponent
  ) {
    super(_azrolesService, _injector);
  }

  ngOnInit() {

    this.cols = [
      { field: 'code', header: this._translateService.instant('FORM.CODE'), visible: true, width: 'auto', sort: true, },
      { field: 'title', header: this._translateService.instant('FORM.TITLE'), visible: true, width: 'auto', sort: true, },
      { field: 'description', header: this._translateService.instant('FORM.DESCRIPTION'), visible: true, width: 'auto', },
      { field: 'modified', header: this._translateService.instant('TABLEDATA.MODIFIED'), visible: false, width: 'auto', sort: true, dateFormat: 'dd/MM/yyyy HH:mm' },
      { field: 'modifiedByName', header: this._translateService.instant('TABLEDATA.MODIFIED_BY'), visible: false, width: 'auto' },
    ];
    this.loadServices();
    this.getData();
  }

  edit() {
    this.pEdit.showPopup(this.selectedItems[0].id);
  }

  add() {
    this.pEdit.showPopup();
  }
  viewPermisions() {
    this._router.navigate([`/core/authorization/azroles/haspermissions/${this.selectedItems[0].id}`]);
  }

  loadServices() {
    this.dsAzService = [{ label: this._translateService.instant('AzPermissions.dsIdAzService'), value: 0 }];
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
        this.convertDataToOptions(this.dsAzService, rs.data, 'title');
      }
    });
  }

  getData() {
    this.isLoading = true;
    this._azrolesService.find(this.query, this.status, this.idAzService, this.pageIndex, this.pageSize, this.orderCol, this.isDesc)
      .then(response => {
        this.dataSource = response.data;

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
}


