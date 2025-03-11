import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase, UserService } from 'vnpost-shared';
import { UnitService } from '../../../../core/services/unit-service';
import { ConvertTimezoneService } from '../../../service/convert-timezone.service';
import { TopicManagerService } from '../../../service/topic-manager.service';
import { ProjectBatchService } from '../../../service/project-batch.service';
import { ProjetcManagerService } from '../../../service/projetc-manager.service';

@Component({
  selector: 'app-add-project-batch',
  templateUrl: './add-project-batch.component.html',
  styleUrls: ['./add-project-batch.component.css'],
})
export class AddProjectBatchComponent
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
    protected _service: ProjectBatchService,
    private _projectService: ProjetcManagerService,
    protected _userService: UserService,
    private _unitService: UnitService,
    protected _injector: Injector
  ) {
    super(_service, _injector);
    this.formGroup = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      beginDate: new UntypedFormControl('', [Validators.required]),
      endDate: new UntypedFormControl('', [Validators.required]),
      idTeacher: new UntypedFormControl([], [Validators.required]),
      idStudent: new UntypedFormControl([], [Validators.required]),
      idProjetcs: new UntypedFormControl([], [Validators.required]),
    });
    this.currentDate = new Date();
  }

  ngOnInit() {
    this.getListUnit();
    this.getAllProjects();
  }

  onShowPopup() {
    this.validationSummary.resetErrorMessages();
    this.resetForm();

    this.onReset();

    this.itemDetail.id = 0;
    this.itemDetail.status = '1';
    this.getListUnit();
    this.getAllUser();
    this.getAllProjects();
  }

  getAllUser() {
    var model = {
      keyword: '',
      status: 1,
      unitCode: this.unitCode,
      pageIndex: 1,
      pageSize: 1000000000,
      orderCol: 'Id',
      isDesc: true,
      typeId: 1,
    };

    this._userService.find(model).then((rs) => {
      if (rs.success) {
        this.listTeacher = rs?.data
          ?.filter((r) => r.department === '3')
          .map((r) => ({
            label: r.displayName,
            value: r.id,
          }));
        this.listStudent = rs?.data
          ?.filter((r) => r.department === '4')
          .map((r) => ({
            label: r.displayName,
            value: r.id,
          }));
      } else {
        this.listTeacher = [];
        this.listStudent = [];
      }
    });
  }

  getAllProjects() {
    this._projectService.getsAll().then((rs) => {
      if (rs.success) {
        this.listProjetcs = rs?.data.map((r) => ({
          label: r.name,
          value: r.id,
        }));
      } else {
        this.listProjetcs = [];
      }
    });
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
    this._service.addProjectBatch(model).then(
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
