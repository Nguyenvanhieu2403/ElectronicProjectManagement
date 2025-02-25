import { Component, OnInit, Injector } from '@angular/core';
import { SecondPageEditBase, UserService } from 'vnpost-shared';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { passwordPattern } from '../../../config/password.config';
import { CoreUserService } from '../../services/core-user.service';

@Component({
  selector: 'app-users-resetpasswd',
  templateUrl: './resetpasswd.component.html',
  styleUrls: ['./resetpasswd.component.scss']
})
export class UsersResetpasswdComponent extends SecondPageEditBase implements OnInit {

  constructor(
    protected _userService: UserService,
    protected _injector: Injector,
    private _coreUserService: CoreUserService,
  ) {
    super(_userService, _injector);


  }

  ngOnInit() {
    this.formGroup = new UntypedFormGroup({
      newPassword: new UntypedFormControl('', [Validators.required, //Validators.pattern(passwordPattern)
      ]),
    });
  }

  onShowPopup(id: any) {
    // this.resetForm();
    console.log(passwordPattern);
    this.submitting = true;
    this.validationSummary.resetErrorMessages();
    if (id > 0) {
      this._userService.getById(id).then(rs => {
        if (rs.success) {
          this.itemDetail = rs.data;
        }
      }, error => {
        this._notifierService.showWarning(this._translateService.instant('MESSAGE.NOT_FOUND_ERROR'));

      });
      this.submitting = false;
    } else {
      this.closePopupMethod(false);
    }
  }

  restorePassword() {
    this.submitting = true;
    if (this.formGroup.invalid) {
      this.validationSummary.showValidationSummary();
      this.showValidateMessage();
      this.submitting = false;
      this.scrollToTop();
      return;
    }
    this._coreUserService.resetPassword(this.itemDetail)
      .then(response => {
        if (response.success) {
          this.closePopupMethod(true);
          this._notifierService.showUpdateDataSuccess();
          this.onAfterSave();
        } else {
          this._notifierService.showWarning(this._translateService.instant(response.error));
        }

        this.submitting = false;
      }, error => {
        this._notifierService.showUpdateDataFailed();
        this.submitting = false;
      });
  }
}
