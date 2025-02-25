import { Component, OnInit, Injector } from '@angular/core';
import { SecondPageEditBase, UserService } from 'vnpost-shared';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { UnitService } from '../../services/unit-service';
import { HubServiceService } from '../../services/hub-service.service';

@Component({
  selector: 'app-users-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class UsersEditComponent extends SecondPageEditBase implements OnInit {
  listUnit: { label: string; value: string }[] = [];

  constructor(
    protected _userService: UserService,
    protected _injector: Injector,
    private _hubService: UnitService,
    private _unitService: UnitService
  ) {
    super(_userService, _injector);
    this.formGroup = new UntypedFormGroup({
      userName: new UntypedFormControl({ disable: true }, [
        Validators.required,
      ]),
      displayName: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.email]),
      unitCode: new UntypedFormControl('', [Validators.required]),
      //gender: new UntypedFormControl(''),
      status: new UntypedFormControl(''),
    });
  }

  ngOnInit() {}

  getListUnit() {
    this._hubService
      .getTreeUnitByUnitCode(this.currentUser?.unitCode)
      .then((rs) => {
        if (rs.success) {
          this.listUnit = rs?.data?.map((r) => ({
            label: `- ${r.unitName} (${r.unitCode})`,
            value: r.unitCode,
          }));
        } else {
          this.listUnit = [];
        }
      });
  }

  onShowPopup(itemId: any) {
    if (this.listUnit.length == 0) {
      this.getListUnit();
    }
    this.validationSummary.resetErrorMessages();
    this.resetForm();

    if (itemId > 0) {
      this._userService.getById(itemId).then(
        async (rs) => {
          this.itemDetail = rs.data;
          if (this.itemDetail.dateOfBirth) {
            this.itemDetail.dateOfBirth = new Date(this.itemDetail.dateOfBirth);
          }
        },
        (error) => {
          this._notifierService.showWarning(
            this._translateService.instant('MESSAGE.NOT_FOUND_ERROR')
          );
        }
      );
    }
  }

  async save() {
    this.submitting = true;

    if (this.itemDetail.passwordHash !== this.itemDetail.confirmPassword) {
      this.formGroup.controls['passwordHash'].setErrors({ nomatch: true });
      this.formGroup.setErrors({ invalid: true });
      this.showValidateMessage();
      return;
    }

    if (this.formGroup.invalid) {
      this.submitting = false;
      this.validationSummary.showValidationSummary();
      return;
    }

    this.onBeforeSave();
    if (this.itemDetail['id']) {
      this.onUpdate();
    }
  }

  onUpdate() {
    this._baseService
      .put(this.itemDetail['id'].toString(), this.itemDetail)
      .then(
        (response) => {
          this.closePopupMethod(true);
          this._notifierService.showUpdateDataSuccess();
          this.onAfterSave();
          this.submitting = false;
        },
        (error) => {
          this._notifierService.showUpdateDataFailed();
          this.submitting = false;
        }
      );
  }
}
