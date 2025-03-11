import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase } from 'vnpost-shared';
import { UnitService } from '../../../../core/services/unit-service';
import { ConvertTimezoneService } from '../../../service/convert-timezone.service';
import { TopicManagerService } from '../../../service/topic-manager.service';
import { ProjetcManagerService } from '../../../service/projetc-manager.service';

@Component({
  selector: 'app-add-project-manager',
  templateUrl: './add-project-manager.component.html',
  styleUrls: ['./add-project-manager.component.css'],
})
export class AddProjectManagerComponent
  extends SecondPageEditBase
  implements OnInit
{
  listTopic: { label: string; value: string }[] = [];

  constructor(
    protected _service: ProjetcManagerService,
    private _timerService: ConvertTimezoneService,
    private _topicService: TopicManagerService,
    protected _injector: Injector
  ) {
    super(_service, _injector);
    this.formGroup = new UntypedFormGroup({
      topic: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getListTopic();
  }

  onShowPopup() {
    this.validationSummary.resetErrorMessages();
    this.resetForm();

    this.onReset();

    this.itemDetail.id = 0;
    this.itemDetail.status = '1';
    this.getListTopic();
  }

  getListTopic() {
    this._topicService.getsAll().then((rs) => {
      if (rs.success) {
        this.listTopic = rs?.data?.map((r) => ({
          label: `- ${r.name}`,
          value: r.id,
        }));
      } else {
        this.listTopic = [];
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
    this._service.addProjects(model).then(
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
