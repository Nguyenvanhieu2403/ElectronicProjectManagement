import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase } from 'vnpost-shared';
import { ConvertTimezoneService } from '../../../service/convert-timezone.service';
import { FileService } from '../../../service/file.service';
import { ReferencesFileManagerService } from '../../../service/references-file-manager.service';
import { UnitService } from '../../../../core/services/unit-service';
import { TopicManagerService } from '../../../service/topic-manager.service';

@Component({
  selector: 'app-edit-topic-manager',
  templateUrl: './edit-topic-manager.component.html',
  styleUrls: ['./edit-topic-manager.component.css'],
})
export class EditTopicManagerComponent
  extends SecondPageEditBase
  implements OnInit
{
  listUnit: { label: string; value: string }[] = [];

  constructor(
    protected _service: TopicManagerService,
    private _timerService: ConvertTimezoneService,
    private _fileService: FileService,
    private _unitService: UnitService,
    protected _injector: Injector
  ) {
    super(_service, _injector);
    this.formGroup = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      unitCode: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getListUnit();
  }

  onShowPopup(Id: any) {
    this.validationSummary.resetErrorMessages();
    this.resetForm();
    this.getListUnit();

    if (Id > 0) {
      this._service.getById(Id).then(
        (response) => {
          this.itemDetail = response.data;
        },
        (error) => {
          if (error?.error?.message)
            this._notifierService.showError(error?.error?.message);
          else
            this._notifierService.showWarning(
              this._translateService.instant('MESSAGE.NOT_FOUND_ERROR')
            );
        }
      );
    }
  }

  getListUnit() {
    this._unitService
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

  async save() {
    this.submitting = true;

    if (this.formGroup.invalid) {
      this.submitting = false;
      this.validationSummary.showValidationSummary();
      return;
    }
    this.onInsert();
  }
  async onInsert() {
    const model = this.itemDetail;
    this._service.updateTopic(model).then(
      (response) => {
        this.closePopupMethod(true);
        this._notifierService.showUpdateDataSuccess();
        this.onAfterSave();
        this.submitting = false;
      },
      (error) => {
        this.submitting = false;
        if (error.error.message)
          this._notifierService.showError(error.error.message);
        else
          this._notifierService.showError(
            this._translateService.instant('MESSAGE.ERROR')
          );
      }
    );
  }
}
