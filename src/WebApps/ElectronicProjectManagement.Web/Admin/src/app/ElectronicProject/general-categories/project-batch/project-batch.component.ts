import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageIndexBase } from 'vnpost-shared';
import { FileService } from '../../service/file.service';
import { TopicManagerService } from '../../service/topic-manager.service';
import { AddTopicManagerComponent } from '../topic-manager/add-topic-manager/add-topic-manager.component';
import { EditTopicManagerComponent } from '../topic-manager/edit-topic-manager/edit-topic-manager.component';
import { AddProjectBatchComponent } from './add-project-batch/add-project-batch.component';
import { EditProjectBatchComponent } from './edit-project-batch/edit-project-batch.component';
import { ViewProjectBatchComponent } from './view-project-batch/view-project-batch.component';
import { ProjectBatchService } from '../../service/project-batch.service';
import { finalize } from 'rxjs/operators';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-project-batch',
  templateUrl: './project-batch.component.html',
  styleUrls: ['./project-batch.component.css'],
})
export class ProjectBatchComponent
  extends SecondPageIndexBase
  implements OnInit
{
  @ViewChild('pCreate', { static: false }) pCreate: AddProjectBatchComponent;
  @ViewChild('pEdit', { static: false }) pEdit: EditProjectBatchComponent;
  @ViewChild('pView', { static: false }) pView: ViewProjectBatchComponent;
  formGroup: any;
  currentUnitCode: any = '';
  setWidth: string = '100%';
  dataMotion: any;
  keyword: any;
  beginDate: any;
  endDate: any;

  constructor(
    private _service: ProjectBatchService,
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
        field: 'name',
        header: 'Tên đợt đồ án',
        visible: true,
        sort: true,
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
        sort: true,
        width: 13,
      },
      {
        field: 'totalTeacher',
        header: 'Tổng số giảng viên',
        visible: true,
        sort: true,
        width: 13,
      },
      {
        field: 'totalStudent',
        header: 'Tổng số sinh viên',
        visible: true,
        sort: true,
        width: 13,
      },
      {
        field: 'idProjetcs',
        header: 'Tổng số đề tài đồ án',
        visible: true,
        sort: true,
        width: 13,
      },
      {
        field: 'status',
        header: 'Trạng thái',
        visible: true,
        sort: true,
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
      begindate: null,
      enddate: null,
      status: 1,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      orderCol: this.orderCol,
      isDesc: this.isDesc,
      totalRecord: 0,
    };
    this.isLoading = true;
    this._service
      .getsProjectBatchBySearch(model)
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
      begindate: null,
      enddate: null,
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
    this._service
      .exportExcel(model)
      .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((blob) => {
            saveAs(blob, `Dotdoan_${dateStr}.xlsx`);
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

  onEdit(item: any) {
    if (item.id > 0) {
      this.pEdit.showPopup(item.id);
    }
  }

  onView(item: any, type: any) {
    if (item.id > 0) {
      item.type = type;
      this.pView.showPopup(item);
    }
  }

  onDelete(item: any) {
    if (item && item.id) {
      this._notifierService
        .showConfirm('Bạn có chắc muốn xoá đợt đồ án này không?')
        .then((res) => {
          if (res) {
            this._service.deleteProjectBatch(item.id).then(
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
