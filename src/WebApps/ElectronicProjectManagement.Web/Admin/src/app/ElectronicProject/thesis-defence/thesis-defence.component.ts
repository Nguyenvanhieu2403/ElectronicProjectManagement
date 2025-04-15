import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageIndexBase } from 'vnpost-shared';
import { AddProjectManagerComponent } from '../general-categories/project-manager/add-project-manager/add-project-manager.component';
import { EditProjectManagerComponent } from '../general-categories/project-manager/edit-project-manager/edit-project-manager.component';
import { ImportProjectManagerComponent } from '../general-categories/project-manager/import-project-manager/import-project-manager.component';
import { FileService } from '../service/file.service';
import { ThesisDefenceService } from '../service/thesis-defence.service';
import { AddThesisDefenceComponent } from './add-thesis-defence/add-thesis-defence.component';
import { CommentThesisDefenceComponent } from './comment-thesis-defence/comment-thesis-defence.component';
import { finalize } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-thesis-defence',
  templateUrl: './thesis-defence.component.html',
  styleUrls: ['./thesis-defence.component.css'],
})
export class ThesisDefenceComponent
  extends SecondPageIndexBase
  implements OnInit
{
  @ViewChild('pCreate', { static: false }) pCreate: AddThesisDefenceComponent;
  @ViewChild('pComment', { static: false })
  pComment: CommentThesisDefenceComponent;
  formGroup: any;
  currentUnitCode: any = '';
  setWidth: string = '210rem';
  dataMotion: any;
  keyword: any;

  constructor(
    private _service: ThesisDefenceService,
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
        field: 'nameThesisDefence',
        header: 'Tên đợt bảo vệ',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'projectBatchName',
        header: 'Tên đợt đồ án',
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
        header: 'Tên tên đề tài',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'nameStudent',
        header: 'Tên sinh viên',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'nameSupervisor',
        header: 'Tên giảng viên hướng dẫn',
        visible: true,
        sort: false,
        width: 13,
      },

      {
        field: 'point',
        header: 'Điểm',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'comment',
        header: 'Nhận xét',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'beginDate',
        header: 'Ngày bắt đầu',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'endDate',
        header: 'Ngày kết thúc',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'location',
        header: 'Địa điểm',
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
      .getsThesisDefenceBySearch(model)
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
    this._service.exportExcel(model)
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe((blob) => {
      saveAs(blob, `DanhSachDoAnBaoVe_${dateStr}.xlsx`);
    });
  }

  downloadFile(item: any) {
    if (!item) return;

    const filePath = item.path;
    const fileName = item.fileName;

    this._fileService.getFiles(filePath).subscribe({
      next: (blob) => {
        if (blob.size > 5242880) {
          // 5MB
          this._notifierService.showWarning(
            'File tải xuống vượt quá 5MB. Vui lòng thử lại!'
          );
          return;
        }

        // Tạo đối tượng File
        const file = new File([blob], fileName, { type: blob.type });

        // Đọc file và tạo URL để tải xuống
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const downloadBlob = new Blob([fileReader.result as ArrayBuffer], {
            type: file.type,
          });
          const downloadUrl = URL.createObjectURL(downloadBlob);

          // Tạo thẻ <a> để tải file
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Giải phóng URL sau khi tải xong
          URL.revokeObjectURL(downloadUrl);
        };
        fileReader.readAsArrayBuffer(file);
      },
      error: (error) => {
        console.error('Lỗi khi tải file:', error);
        this._notifierService.showError(
          'Không thể tải file. Vui lòng thử lại!'
        );
      },
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

  onAdd() {
    this.pCreate.showPopup();
  }

  onComment(item: any) {
    this.pComment.showPopup(item);
  }

  onDelete(item: any) {
    if (item && item.id) {
      this._notifierService
        .showConfirm('Bạn có chắc muốn xoá đề tài đồ án này không?')
        .then((res) => {
          if (res) {
            this._service.deleteProject(item.id).then(
              (response) => {
                this._notifierService.showDeleteDataSuccess();
                this.getData();
              },
              (error) => {
                this._notifierService.showDeleteDataError();
              }
            );
          }
        });
    }
  }
}
