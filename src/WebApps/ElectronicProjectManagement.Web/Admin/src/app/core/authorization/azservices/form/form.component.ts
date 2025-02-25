import { Component, OnInit, Injector } from '@angular/core';
import { AzServicesService } from '../../../services/azservices.service';
import { SecondPageEditBase } from 'vnpost-shared';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-azservices-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AzServicesFormComponent extends SecondPageEditBase implements OnInit {

  constructor(
    protected _servicesService: AzServicesService,
    protected _injector: Injector,
  ) {
    super(_servicesService, _injector);

    this.formGroup = new UntypedFormGroup({
      code: new UntypedFormControl('', [Validators.required]),
      title: new UntypedFormControl('', [Validators.required]),
      idType: new UntypedFormControl(''),
      description: new UntypedFormControl(''),
      status: new UntypedFormControl(''),
    });
  }

  async ngOnInit() {
  }

  async onShowPopup(id) {
    // this.resetForm();
    this.submitting = true;
    this.validationSummary.resetErrorMessages();
    if (id > 0) {
      this._servicesService.getById(id).then(rs => {
        this.submitting = false;
        if (rs.success) {
          this.itemDetail = rs.data;
        }
      }, error => {
        this._notifierService.showWarning(this._translateService.instant('MESSAGE.NOT_FOUND_ERROR'));
        this.submitting = false;
      });
    } else {
      this.itemDetail = { id: 0 };
      this.submitting = false;
    }
  }
}
