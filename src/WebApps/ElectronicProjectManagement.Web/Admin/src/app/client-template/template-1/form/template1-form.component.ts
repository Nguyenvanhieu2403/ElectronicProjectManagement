import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SecondPageEditBase } from 'vnpost-shared';
import { TemplateApiService } from '../services/template-api.service';

@Component({
  selector: 'app-template1-form',
  templateUrl: './template1-form.component.html',
  styleUrls: ['./template1-form.component.scss']
})
export class Template1FormComponent extends SecondPageEditBase implements OnInit {

  constructor(
    protected _templateApiService: TemplateApiService,
    protected _injector: Injector,
  ) {
    super(_templateApiService, _injector);

    this.formGroup = new UntypedFormGroup({
      code: new UntypedFormControl('', Validators.required),
      title: new UntypedFormControl('', Validators.required),
      colDateTime: new UntypedFormControl(''),
      description: new UntypedFormControl(''),
      status: new UntypedFormControl(''),
    });
  }

  ngOnInit() {
  }

  onShowPopup(id: number) {
    this.submitting = true;
    if (id > 0) {
      this._templateApiService.getById(id).then(rs => {
        this.submitting = false;
        console.log(rs);
        if (rs.success) {
          this.itemDetail = rs.data;
          if (this.itemDetail.colDateTime) {
            this.itemDetail.colDateTime = new Date(this.itemDetail.colDateTime);
          }
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

