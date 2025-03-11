import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageIndexBase } from 'vnpost-shared';
import { AddReferencesFileManagerComponent } from '../../references-file-manager/add-references-file-manager/add-references-file-manager.component';
import { EditReferencesFileManagerComponent } from '../../references-file-manager/edit-references-file-manager/edit-references-file-manager.component';
import { FileService } from '../../service/file.service';
import { TopicManagerService } from '../../service/topic-manager.service';
import { AddTopicManagerComponent } from './add-topic-manager/add-topic-manager.component';
import { EditTopicManagerComponent } from './edit-topic-manager/edit-topic-manager.component';

@Component({
  selector: 'app-topic-manager',
  templateUrl: './topic-manager.component.html',
  styleUrls: ['./topic-manager.component.css'],
})
export class TopicManagerComponent
  extends SecondPageIndexBase
  implements OnInit
{
  @ViewChild('pCreate', { static: false }) pCreate: AddTopicManagerComponent;
  @ViewChild('pEdit', { static: false }) pEdit: EditTopicManagerComponent;
  formGroup: any;
  currentUnitCode: any = '';
  setWidth: string = '100%';
  dataMotion: any;
  keyword: any;

  constructor(
    private _service: TopicManagerService,
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
        header: 'Tên chủ đề',
        visible: true,
        sort: true,
        width: 13,
      },
      {
        field: 'unitCode',
        header: 'Khoa',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'description',
        header: 'Mô tả',
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
      status: 1,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      orderCol: this.orderCol,
      isDesc: this.isDesc,
      totalRecord: 0,
    };
    this.isLoading = true;
    this._service
      .getsTopicBySearch(model)
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

  onDelete(item: any) {
    if (item && item.id) {
      this._notifierService
        .showConfirm('Bạn có chắc muốn xoá tài liệu tham khảo này không?')
        .then((res) => {
          if (res) {
            this._service.deleteReferencesFile(item.id).then(
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
