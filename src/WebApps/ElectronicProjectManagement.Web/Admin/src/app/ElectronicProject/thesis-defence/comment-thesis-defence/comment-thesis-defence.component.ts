import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase, UserService } from 'vnpost-shared';
import { UnitService } from '../../../core/services/unit-service';
import { ProjetcManagerService } from '../../service/projetc-manager.service';
import { ThesisDefenceService } from '../../service/thesis-defence.service';

@Component({
  selector: 'app-comment-thesis-defence',
  templateUrl: './comment-thesis-defence.component.html',
  styleUrls: ['./comment-thesis-defence.component.css'],
})
export class CommentThesisDefenceComponent
  extends SecondPageEditBase
  implements OnInit
{
  listUnit: { label: string; value: string }[] = [];
  beginDate: any;
  endDate: any;
  listTeacher: { label: string; value: string }[] = [];
  listStudent: { label: string; value: string }[] = [];
  listProjetcs: { label: string; value: string }[] = [];
  idTeacher: any;
  idStudent: any;
  unitCode = this.currentUser?.unitCode;
  currentDate: any;
  constructor(
    protected _service: ThesisDefenceService,
    private _projectService: ProjetcManagerService,
    protected _userService: UserService,
    private _unitService: UnitService,
    protected _injector: Injector
  ) {
    super(_service, _injector);
    this.formGroup = new UntypedFormGroup({
      nameThesisDefence: new UntypedFormControl('', [Validators.required]),
      projectBatchName: new UntypedFormControl('', [Validators.required]),
      topicName: new UntypedFormControl('', [Validators.required]),
      projectName: new UntypedFormControl('', [Validators.required]),
      nameStudent: new UntypedFormControl('', [Validators.required]),
      nameSupervisor: new UntypedFormControl('', [Validators.required]),
      point: new UntypedFormControl('', [Validators.required]),
      comment: new UntypedFormControl(''),
    });
    this.currentDate = new Date();
  }

  ngOnInit() {}

  onShowPopup(data: any) {
    this.validationSummary.resetErrorMessages();
    this.resetForm();

    this.onReset();

    if (data) {
      console.log(data);
      this.itemDetail = data;
    }
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
    if (this.itemDetail.point < 0 || this.itemDetail.point > 10) {
      this._notifierService.showError('Điểm phải nằm trong khoảng từ 0 đến 10');
      this.submitting = false;
      return;
    }

    const model = {
      id: this.itemDetail.idThesisDefenceDetail,
      point: this.itemDetail.point,
      comment: this.itemDetail.comment,
    };
    this._service.scoringThesisDefence(model).then(
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
        else this._notifierService.showError('Có lỗi xảy ra khi chấm điểm');
      }
    );
  }
}
