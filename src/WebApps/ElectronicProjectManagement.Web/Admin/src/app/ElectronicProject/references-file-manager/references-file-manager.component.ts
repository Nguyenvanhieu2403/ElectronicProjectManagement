import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { SecondPageIndexBase } from 'vnpost-shared';
import { UnitService } from '../../core/services/unit-service';
import { ReferencesFileManagerService } from '../service/references-file-manager.service';
import { saveAs } from 'file-saver';
import { environment } from '../../../environments/environment';
import { AddReferencesFileManagerComponent } from './add-references-file-manager/add-references-file-manager.component';
import { EditReferencesFileManagerComponent } from './edit-references-file-manager/edit-references-file-manager.component';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-references-file-manager',
  templateUrl: './references-file-manager.component.html',
  styleUrls: ['./references-file-manager.component.css']
})
export class ReferencesFileManagerComponent extends SecondPageIndexBase implements OnInit
{
  @ViewChild('pCreate', { static: false }) pCreate: AddReferencesFileManagerComponent;
  @ViewChild('pEdit', { static: false }) pEdit: EditReferencesFileManagerComponent;
  formGroup: any;
  currentUnitCode: any = '';
  setWidth: string = '100%';
  dataMotion: any;
  keyword: any;

  constructor(
    private _service: ReferencesFileManagerService,
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
        field: 'title',
        header: 'Tiêu đề',
        visible: true,
        sort: true,
        width: 13,
      },
      {
        field: 'author',
        header: 'Tác giả',
        visible: true,
        sort: true,
        width: 13,
      },
      {
        field: 'documentType',
        header: 'Loại tài liệu',
        visible: true,
        sort: true,
        width: 20,
      },
      {
        field: 'yearPublication',
        header: 'Năm xuất bản',
        visible: true,
        sort: true,
        width: 20,
      },
      {
        field: 'fileName',
        header: 'Tên file',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'description',
        header: 'Mô tả',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'field',
        header: 'Lĩnh vực',
        visible: true,
        sort: true,
        width: 20,
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
      unitCodeSend: new UntypedFormControl(''),
      unitCodeReceive: new UntypedFormControl(''),
      groupService: new UntypedFormControl(''),
      territory: new UntypedFormControl(''),
      typeService: new UntypedFormControl(''),
      customerCode: new UntypedFormControl(''),
      groupCustomer: new UntypedFormControl(''),
      service: new UntypedFormControl(''),
      weight: new UntypedFormControl(''),
      limit: new UntypedFormControl(''),
    });
    this.orderCol = "Id";
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
      totalRecord: 0
    };
    this.isLoading = true;
    this._service.getsReferencesFile(model)
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
      totalRecord: 0
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
      saveAs(blob, `TaiLieuThamKhao_${dateStr}.xlsx`);
    });
  }

  downloadFile(item: any) {
    if (!item) return;
    
    const filePath = item.path;
    const fileName = item.fileName;
    
    this._fileService.getFiles(filePath).subscribe({
        next: (blob) => {
            // Tạo đối tượng File
            const file = new File([blob], fileName, { type: blob.type });

            // Đọc file và tạo URL để tải xuống
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const downloadBlob = new Blob([fileReader.result as ArrayBuffer], { type: file.type });
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
            console.error("Lỗi khi tải file:", error);
            this._notifierService.showError("Không thể tải file. Vui lòng thử lại!");
        }
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
