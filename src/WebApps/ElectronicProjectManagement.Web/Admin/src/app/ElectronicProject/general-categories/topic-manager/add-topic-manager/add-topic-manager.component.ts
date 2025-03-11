import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase } from 'vnpost-shared';
import { ConvertTimezoneService } from '../../../service/convert-timezone.service';
import { ReferencesFileManagerService } from '../../../service/references-file-manager.service';
import { UnitService } from '../../../../core/services/unit-service';
import { TopicManagerService } from '../../../service/topic-manager.service';

@Component({
  selector: 'app-add-topic-manager',
  templateUrl: './add-topic-manager.component.html',
  styleUrls: ['./add-topic-manager.component.css'],
})
export class AddTopicManagerComponent
  extends SecondPageEditBase
  implements OnInit
{
  listUnit: { label: string; value: string }[] = [];

  constructor(
    protected _service: TopicManagerService,
    private _timerService: ConvertTimezoneService,
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

  onShowPopup() {
    this.validationSummary.resetErrorMessages();
    this.resetForm();

    this.onReset();

    this.itemDetail.id = 0;
    this.itemDetail.status = '1';
    this.getListUnit();
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
    this._service.addTopic(model).then(
      (response) => {
        this.closePopupMethod(true);
        this._notifierService.showInsertDataSuccess();
        this.onAfterSave();
        this.submitting = false;
      },
      (error) => {
        this.submitting = false;
        if (error.error.message)
          this._notifierService.showError(error.error.message);
        else this._notifierService.showError('Có lỗi xảy ra khi thêm mới');
      }
    );
  }
}
