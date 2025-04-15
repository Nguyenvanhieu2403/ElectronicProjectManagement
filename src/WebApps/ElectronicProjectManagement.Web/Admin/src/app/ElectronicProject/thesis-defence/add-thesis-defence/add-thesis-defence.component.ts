import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase, UserService } from 'vnpost-shared';
import { UnitService } from '../../../core/services/unit-service';
import { ProjectBatchService } from '../../service/project-batch.service';
import { ProjetcManagerService } from '../../service/projetc-manager.service';
import { ThesisDefenceService } from '../../service/thesis-defence.service';

@Component({
  selector: 'app-add-thesis-defence',
  templateUrl: './add-thesis-defence.component.html',
  styleUrls: ['./add-thesis-defence.component.css'],
})
export class AddThesisDefenceComponent
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
      name: new UntypedFormControl('', [Validators.required]),
      location: new UntypedFormControl('', [Validators.required]),
      beginDate: new UntypedFormControl('', [Validators.required]),
      endDate: new UntypedFormControl('', [Validators.required]),
      idTeacher: new UntypedFormControl([], [Validators.required]),
      idPersonalProjectManagement: new UntypedFormControl(
        [],
        [Validators.required]
      ),
    });
    this.currentDate = new Date();
  }

  ngOnInit() {
    this.getAllProjects();
  }

  onShowPopup() {
    this.validationSummary.resetErrorMessages();
    this.resetForm();

    this.onReset();

    this.itemDetail.id = 0;
    this.itemDetail.status = '1';
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
    this._service.getsAllPersonalProjectManagement().then((rs) => {
      if (rs.success) {
        this.listProjetcs = rs?.data.map((r) => ({
          label: r.projectName,
          value: r.idProjectsTeachersStudents,
        }));
      } else {
        this.listProjetcs = [];
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
    this._service.createThesisDefence(model).then(
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
