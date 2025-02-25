import { Component, OnInit, ViewChild, Output, EventEmitter, Injector } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, FormGroup, FormControl } from '@angular/forms';
import { AzPermissionsService } from '../../../services/azpermissions.service';
import { AzServicesService } from '../../../services/azservices.service';
import { NotifierService, SecondPageEditBase, ValidationSummaryComponent } from 'vnpost-shared';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-azpermissions-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class AzPermissionsImportComponent extends SecondPageEditBase implements OnInit {

  dsServices = [];
  idAzService = 0;
  arrServices = [];

  constructor(
    protected _servicesService: AzServicesService,
    protected _permissionsService: AzPermissionsService,
    protected _notifierService: NotifierService,
    protected _injector: Injector,
  ) {
    super(null, _injector);
    this.formGroup = new UntypedFormGroup({
      idAzService: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit() {

  }

  loadServices() {
    if (this.dsServices.length === 0) {
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
          this.arrServices = rs.data;
          // this.convertDataToOptions(this.dsServices, rs.data, 'title');
          this.dsServices = rs?.data?.map(x => ({ label: x.title, value: x.id }));
        }
      });
    }

  }

  onShowPopup(idAzService: number) {
    if (this.dsServices.length == 0) {
      this.loadServices();
    }
    this.validationSummary.resetErrorMessages();
    if (idAzService > 0) {
      this.idAzService = idAzService;
    }
  }

  save() {
    this.submitting = true;
    const itemDetail = this.arrServices.filter(x => x.id === this.idAzService)[0];
    if (itemDetail !== undefined) {
      this._permissionsService.syncPermissionsByIdService(this.idAzService, `${environment.apiDomain.gateway}/${itemDetail.code}/api-discovery`).then(rs => {
        if (rs.success) {
          this._notifierService.showUpdateDataSuccess();
          this.closePopupMethod(true);
          this.submitting = false;
        }
      });
    }
  }
}

