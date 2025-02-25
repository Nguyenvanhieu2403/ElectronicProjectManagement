import { Component, OnInit, Injector } from '@angular/core';
import { SecondPageEditBase } from 'vnpost-shared';
import { AzRolesService } from '../../../services/az-roles.service';
import { AzServicesService } from '../../../services/azservices.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-azroles-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AzRolesFormComponent extends SecondPageEditBase implements OnInit {

  dsAzService = [];
  constructor(
    protected _azrolesService: AzRolesService,
    protected _injector: Injector,
    protected _servicesService: AzServicesService,
  ) {
    super(_azrolesService, _injector);

    this.formGroup = new UntypedFormGroup({
      idAzService: new UntypedFormControl('', [Validators.required]),
      code: new UntypedFormControl('', [Validators.required]),
      title: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl(''),
      status: new UntypedFormControl(''),
    });
  }

  ngOnInit() {
  }

  onShowPopup(id) {
    // this.resetForm();
    if (this.dsAzService.length === 0) {
      this.loadServices();
    }

    this.submitting = true;
    this.validationSummary.resetErrorMessages();
    if (id > 0) {

      this._azrolesService.getById(id).then(rs => {
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

  loadServices() {
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
        this.dsAzService = rs?.data?.map(x => ({ label: x.title, value: x.id }));
        // this.convertDataToOptions(this.dsAzService, rs.data, 'title');
      }
    });
  }
}

