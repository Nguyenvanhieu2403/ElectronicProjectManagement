import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageIndexBase } from 'vnpost-shared';
import { FileService } from '../service/file.service';
import { TopicManagerService } from '../service/topic-manager.service';
import { ProjectsTeachersStudentsService } from '../service/projects-teachers-students.service';
import { ViewProjectBatchComponent } from '../general-categories/project-batch/view-project-batch/view-project-batch.component';
import { ViewRegisterForInstructorsComponent } from './view-register-for-instructors/view-register-for-instructors.component';
import { finalize } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-register-for-instructors',
  templateUrl: './register-for-instructors.component.html',
  styleUrls: ['./register-for-instructors.component.css'],
})
export class RegisterForInstructorsComponent
  extends SecondPageIndexBase
  implements OnInit
{
  @ViewChild('pView', { static: false })
  pView: ViewRegisterForInstructorsComponent;
  formGroup: any;
  currentUnitCode: any = '';
  setWidth: string = '100%';
  dataMotion: any;
  keyword: any;
  infor: any;

  constructor(
    private _service: ProjectsTeachersStudentsService,
    private _fileService: FileService,
    protected _injector: Injector,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    super(_service, _injector);
    this.currentUnitCode = this.currentUser?.unitCode;
    this.cols = [
      {
        field: 'stt',
        header: 'STT',
        visible: true,
        sort: false,
        width: 3,
      },
      {
        field: 'displayName',
        header: 'Tên giảng viên',
        visible: true,
        sort: true,
        width: 13,
      },
      {
        field: 'email',
        header: 'Email',
        visible: true,
        sort: true,
        width: 13,
      },
      {
        field: 'phoneNumber',
        header: 'Số điện thoại',
        visible: true,
        sort: true,
        width: 13,
      },
      {
        field: 'countStudent',
        header: 'Số lượng sinh viên đã đăng ký',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'action',
        header: 'Hành động',
        visible: true,
        sort: false,
        width: 20,
      },
    ];
    this.formGroup = new UntypedFormGroup({
      keyword: new UntypedFormControl(''),
    });
    this.orderCol = 'Id';
    this.infor = JSON.parse(localStorage.getItem('id_token_claims_obj'));
  }
  async ngOnInit() {
    this.search();
  }

  search() {
    this.pageIndex = 1;
    this.pageSize = 20;
    this.totalRecord = 0;
    this.getData();
  }

  getData() {
    const model = {
      keyword: this.keyword,
      status: 1,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      orderCol: this.orderCol,
      isDesc: this.isDesc,
      totalRecord: 0,
    };
    this.isLoading = true;
    this._service
      .getsProjectsTeachersStudentsBySearch(model)
      .then((rs) => {
        if (rs.success) {
          this.dataSource = rs?.data;
          this.totalRecord = rs?.totalRecord;
        } else {
          this.dataSource = [];
          this.totalRecord = 0;
        }
      })
      .finally(() => (this.isLoading = false));
  }

  exportExcel() {
    const model = {
      keyword: this.keyword,
      status: 1,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      orderCol: this.orderCol,
      isDesc: this.isDesc,
      totalRecord: 0,
    };
    const date = new Date();
        const dateStr = `${date.getDate().toString().padStart(2, '0')}_${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}_${date.getFullYear()}`;
        this.isLoading = true;
        this._service.projectsTeachersStudentsExportExcel(model)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((blob) => {
          saveAs(blob, `Danhsachgiangvienhuongdan_${dateStr}.xlsx`);
        });
  }

  onSelectedVisible() {
    var dataWidth = 0;
    this.cols.forEach((e) => {
      if (e.visible == true) {
        dataWidth += e.width;
      }
    });
    this.setWidth = dataWidth + 'rem';
  }

  onRegister(item: any) {
    if (item && item.id) {
      this._notifierService
        .showConfirm('Bạn có chắc muốn đăng ký giảng viên hướng dẫn này không?')
        .then((res) => {
          if (res) {
            const model = {
              idTeacher: item.id,
              idStudent: Number.parseInt(this.infor.userid),
              idProjectBatch: item.idProjectBatch,
            };
            this._service.registerTeachers(model).then(
              (response) => {
                this._notifierService.showUpdateDataSuccess();
                this.getData();
              },
              (error) => {
                this._notifierService.showError(error?.error?.error);
              }
            );
          }
        });
    }
  }

  onView(item: any) {
    if (item.id > 0) {
      this.pView.showPopup(item);
    }
  }
}
