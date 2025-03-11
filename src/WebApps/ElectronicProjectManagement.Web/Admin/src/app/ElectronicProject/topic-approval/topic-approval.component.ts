import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageIndexBase } from 'vnpost-shared';
import { ViewRegisterForInstructorsComponent } from '../register-for-instructors/view-register-for-instructors/view-register-for-instructors.component';
import { FileService } from '../service/file.service';
import { ProjectsTeachersStudentsService } from '../service/projects-teachers-students.service';
import { ProjetcManagerService } from '../service/projetc-manager.service';

@Component({
  selector: 'app-topic-approval',
  templateUrl: './topic-approval.component.html',
  styleUrls: ['./topic-approval.component.css'],
})
export class TopicApprovalComponent
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
    private _service: ProjetcManagerService,
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
        field: 'nameStudent',
        header: 'Tên sinh viên đề suất',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'unitName',
        header: 'Lớp hành chính',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'nameTeacher',
        header: 'Giảng viên hướng dẫn',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'topicName',
        header: 'Tên chủ đề',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'projectName',
        header: 'Tên đề tài',
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
      idTeacher: Number.parseInt(this.infor.userid),
      totalRecord: 0,
    };
    this.isLoading = true;
    this._service
      .getsStudentsProposedTopics(model)
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

  exportExcel() {}

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
        .showConfirm('Bạn có chắc muốn phê duyệt đề tài này không?')
        .then((res) => {
          if (res) {
            this._service.approveTopic(item.id).then(
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

  onReject(item: any) {
    if (item && item.id) {
      this._notifierService
        .showConfirm('Bạn có chắc muốn từ chối đề tài này không?')
        .then((res) => {
          if (res) {
            this._service.rejectTopic(item.id).then(
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
