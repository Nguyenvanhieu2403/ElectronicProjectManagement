import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase } from 'vnpost-shared';
import { UnitService } from '../../../../core/services/unit-service';
import { ConvertTimezoneService } from '../../../service/convert-timezone.service';
import { FileService } from '../../../service/file.service';
import { TopicManagerService } from '../../../service/topic-manager.service';
import { ProjetcManagerService } from '../../../service/projetc-manager.service';

@Component({
  selector: 'app-edit-project-manager',
  templateUrl: './edit-project-manager.component.html',
  styleUrls: ['./edit-project-manager.component.css'],
})
export class EditProjectManagerComponent
  extends SecondPageEditBase
  implements OnInit
{
  listTopic: { label: string; value: string }[] = [];

  constructor(
    protected _service: ProjetcManagerService,
    private _timerService: ConvertTimezoneService,
    private _fileService: FileService,
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

  onShowPopup(Id: any) {
    this.validationSummary.resetErrorMessages();
    this.resetForm();
    this.getListTopic();

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
    this._service.updateProjects(model).then(
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
