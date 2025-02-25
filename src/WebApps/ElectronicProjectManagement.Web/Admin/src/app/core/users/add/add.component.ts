import { Component, OnInit, Injector } from '@angular/core';
import { SecondPageEditBase, UserService } from 'vnpost-shared';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { passwordPattern } from '../../../config/password.config';
import { UnitService } from '../../services/unit-service';
import { UserTypeId } from '../../../config/enums';
import { CoreUserService } from '../../services/core-user.service';
import { ConfirmationService } from 'primeng/api';
import { HubServiceService } from '../../services/hub-service.service';

@Component({
  selector: 'app-users-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class UsersAddComponent extends SecondPageEditBase implements OnInit {
  listUnit: { label: string; value: string }[] = [];

  constructor(
    protected _userService: UserService,
    protected _coreUserService: CoreUserService,
    protected _injector: Injector,
    private _hubService: UnitService,
    private _confirmationService: ConfirmationService
  ) {
    super(_userService, _injector);
    this.formGroup = new UntypedFormGroup({
      userName: new UntypedFormControl('', [Validators.required]),
      passwordHash: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(passwordPattern),
      ]),
      confirmPassword: new UntypedFormControl('', [Validators.required]),
      displayName: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.email]),
      unitCode: new UntypedFormControl('', [Validators.required]),
      //gender: new UntypedFormControl(''),
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

  onShowPopup() {
    this.validationSummary.resetErrorMessages();
    this.resetForm();
    if (this.listUnit.length == 0) {
      this.getListUnit();
    }
    this.onReset();
    this.itemDetail.id = 0;
    this.itemDetail.unitCode = this.currentUser.unitCode;
    this.itemDetail.gender = 1;
    this.itemDetail.status = 1;
    this.itemDetail.isSuperUser = false;
    this.itemDetail.typeId = UserTypeId.User;
    this.itemDetail.passwordHash = '123456a@A';
    this.itemDetail.confirmPassword = '123456a@A';
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

    // this._coreUserService
    //   .checkLlbCodeBeforeCreate(
    //     this.itemDetail.userName,
    //     this.itemDetail.unitCode
    //   )
    //   .then(
    //     (res) => {
    //       if (res.data) {
    //         this._confirmationService.confirm({
    //           message:
    //             'Tên đăng nhập đã tồn tại bạn có muốn tạo tên đăng nhập mới không?',
    //           header: 'Xác nhận',
    //           icon: 'pi pi-info-circle',
    //           acceptIcon: 'none',
    //           rejectIcon: 'none',
    //           rejectButtonStyleClass: 'p-button-text',
    //           accept: () => {
    //             this.itemDetail.userName = res.data;
    //             this.submitting = false;
    //           },
    //           reject: () => {},
    //           key: 'positionDialog',
    //         });
    //       } else {
    //         if (this.itemDetail['id']) {
    //           this.onUpdate();
    //         } else {
    //           this.onInsert();
    //         }
    //       }
    //     },
    //     (err) => {
    //       this._notifierService.showError('Có lỗi xảy ra');
    //     }
    //   );

    this.onInsert();
  }

  onInsert() {
    this._baseService.post(this.itemDetail).then(
      (response) => {
        if (this.continueAdding) {
          this.resetForm();
          this.itemDetail.id = 0;
          this.itemDetail.gender = 1;
          this.itemDetail.status = 1;
          this.itemDetail.isSuperUser = false;
          this.itemDetail.typeId = UserTypeId.User;
          this.itemDetail.passwordHash = '123456a@A';
          this.itemDetail.confirmPassword = '123456a@A';
        } else {
          this.closePopupMethod(true);
        }
        this._notifierService.showInsertDataSuccess();
        this.onAfterSave();
        this.submitting = false;
      },
      (error) => {
        if (error.error.error === 'USERNAME_DUPLICATE') {
          this.formGroup.controls['userName'].setErrors({ duplicate: true });
          this.formGroup.setErrors({ invalid: true });
          this.validationSummary.showValidationSummary();
        } else if (error.error.error === 'EMAIL_DUPLICATE') {
          this.formGroup.controls['email'].setErrors({ duplicate: true });
          this.formGroup.setErrors({ invalid: true });
          this.validationSummary.showValidationSummary();
        } else {
          this._notifierService.showInsertDataFailed();
        }
        this.submitting = false;
      }
    );
  }
}
