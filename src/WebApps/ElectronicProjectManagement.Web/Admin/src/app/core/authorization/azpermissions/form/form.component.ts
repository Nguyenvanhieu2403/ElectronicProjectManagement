import { Component, OnInit, Injector } from '@angular/core';
import { SecondPageEditBase } from 'vnpost-shared';
import { AzPermissionsService } from '../../../services/azpermissions.service';
import { AzServicesService } from '../../../services/azservices.service';
import { AzControllersService } from '../../../services/azcontrollers.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-azpermissions-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AzPermissionsFormComponent extends SecondPageEditBase implements OnInit {

  dsServices = [];
  dsControllers = [];
  constructor(
    protected _permissionsService: AzPermissionsService,
    protected _injector: Injector,
    protected _servicesService: AzServicesService,
    protected _controllersService: AzControllersService,
  ) {
    super(_permissionsService, _injector);

    this.formGroup = new UntypedFormGroup({
      permissionName: new UntypedFormControl('', [Validators.required]),
      permissionIndex: new UntypedFormControl('', [Validators.required]),
      idAzService: new UntypedFormControl('', [Validators.required]),
      idAzController: new UntypedFormControl('', Validators.required),
    });
  }

  async ngOnInit() {
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
        // this.convertDataToOptions(this.dsServices, rs.data, 'title');
        this.dsServices = rs?.data?.map(x => ({ label: x.title, value: x.id }));
      }
    });
  }

  loadControllersByService(idService?: number) {
    if (idService === undefined) {
      idService = this.itemDetail.idService;
    }
    this.dsControllers = [{ label: this._translateService.instant('AzPermissions.dsIdAzController'), value: 0 }];
    this._controllersService.getsByIdService(idService).then(rs => {
      if (rs.success) {
        this.convertDataToOptions(this.dsControllers, rs.data, 'title');
      }
    });
  }

  onChangeService() {
    this.loadControllersByService(this.itemDetail.idAzService);
  }

  async onShowPopup(id) {
    // this.resetForm();
    if (this.dsServices.length === 0) {
      this.loadServices();
    }
    await this.loadControllersByService(0);
    this.submitting = true;
    this.validationSummary.resetErrorMessages();
    if (id > 0) {
      this._permissionsService.getById(id).then(rs => {
        this.submitting = false;
        if (rs.success) {
          this.itemDetail = rs.data;
        }
      }, error => {
        this._notifierService.showWarning(this._translateService.instant('MESSAGE.NOT_FOUND_ERROR'));
        this.submitting = false;
      });
    } else {
      this.itemDetail = { id: 0, status: 1 };

      this.submitting = false;
    }
  }
}

