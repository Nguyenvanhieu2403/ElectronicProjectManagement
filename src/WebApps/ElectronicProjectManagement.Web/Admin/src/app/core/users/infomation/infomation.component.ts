import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { SecondPageEditBase, UserService } from 'vnpost-shared';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { passwordPattern } from '../../../config/password.config';
import { CoreUserService } from '../../services/core-user.service';

@Component({
  selector: 'app-users-infomation',
  templateUrl: './infomation.component.html',
  styleUrls: ['./infomation.component.scss']
})
export class UsersInfomationComponent extends SecondPageEditBase implements OnInit {

  invalid = false;
  invalid1 = false;
  @ViewChild('formElement1') formElement1: ElementRef;
  formGroup1: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    protected _userService: UserService,
    protected _injector: Injector,
    private _coreUserservice: CoreUserService,
  ) {
    super(_userService, _injector);
  }

  ngOnInit() {
    this.formGroup = new UntypedFormGroup({
      displayName: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      userName: new UntypedFormControl({ value: '', disabled: true }),
    });
    this.formGroup1 = new UntypedFormGroup({
      oldPassword: new UntypedFormControl('', [Validators.required]),
      newPassword: new UntypedFormControl('', [Validators.required, Validators.pattern(passwordPattern)]),
      confirmPassword: new UntypedFormControl('', [Validators.required]),
    });
    this.invalid = this.formGroup.invalid;
    this.invalid1 = this.formGroup1.valid;
    this.getUserInfo();
  }

  getUserInfo() {
    this.submitting = true;
    this._userService.getById(this.currentUser.userId).then(async rs => {
      if (rs.success) {
        this.itemDetail = rs.data;
      }
      this.submitting = false;
    });
  }

  save() {
    this.submitting = true;
    if (this.formGroup.invalid) {
      this.showValidateMessage();
      this.submitting = false;
      return;
    }
    if (this.itemDetail.userId) {
      this.onUpdate();
    }
  }

  onUpdate() {
    this._coreUserservice.updateMyInfo(this.itemDetail)
      .then(response => {
        this.closePopupMethod(true);
        this._notifierService.showUpdateDataSuccess();
        this.onAfterSave();
        this.submitting = false;
      }, error => {
        this._notifierService.showUpdateDataFailed();
        this.submitting = false;
      });
  }
  onChangePass() {
    if (this.itemDetail.newPassword !== this.itemDetail.confirmPassword) {
      this.formGroup1.controls['newPassword'].setErrors({ 'nomatch': true });
      this._notifierService.showError(this._translateService.instant('Users.ErrPasswordNotMatch'));
      this.formGroup1.setErrors({ 'invalid': true });
      this.invalid = true;
      this.showValidateMessage();
      return;
    }

    if (this.formGroup.invalid) {
      this.invalid = true;
      this.showValidateMessage();
      return;
    }
    this._userService.changePassword(this.itemDetail)
      .then(response => {
        this.closePopupMethod(true);
        this._notifierService.showUpdateDataSuccess();
        this.onAfterSave();
        this.submitting = false;
        this.formGroup1.reset();
      }, error => {
        console.log(error.error.error);
        if (error.error.error === 'Users.Error.Password_Not_Matching') {
          this.invalid1 = true;
          this.formGroup1.controls['oldPassword'].setErrors({ 'incorrect': true });
          this.formGroup1.setErrors({ 'invalid': true });
          this._notifierService.showWarning(this._translateService.instant('Users.ErrorOldPassword'));
          this.showValidateMessage();

        } else {
          this._notifierService.showUpdateDataFailed();
        }
        this.submitting = false;
      });
  }

}
