import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageIndexBase } from 'vnpost-shared';
import { AddReferencesFileManagerComponent } from '../references-file-manager/add-references-file-manager/add-references-file-manager.component';
import { EditReferencesFileManagerComponent } from '../references-file-manager/edit-references-file-manager/edit-references-file-manager.component';
import { FileService } from '../service/file.service';
import { ReferencesFileManagerService } from '../service/references-file-manager.service';
import { AddPersonalProjectManagementComponent } from './add-personal-project-management/add-personal-project-management.component';
import { ProjectBatchService } from '../service/project-batch.service';
import { PersonalProjectManagementService } from '../service/personal-project-management.service';
import { ViewPersonalProjectManagementComponent } from './view-personal-project-management/view-personal-project-management.component';

@Component({
  selector: 'app-personal-project-management',
  templateUrl: './personal-project-management.component.html',
  styleUrls: ['./personal-project-management.component.css'],
})
export class PersonalProjectManagementComponent
  extends SecondPageIndexBase
  implements OnInit
{
  @ViewChild('pCreate', { static: false })
  pCreate: AddPersonalProjectManagementComponent;
  @ViewChild('pEdit', { static: false })
  pEdit: EditReferencesFileManagerComponent;
  @ViewChild('pView', { static: false })
  pView: ViewPersonalProjectManagementComponent;
  formGroup: any;
  currentUnitCode: any = '';
  setWidth: string = '140%';
  dataMotion: any;
  keyword: any;
  listprojectBatch: { label: string; value: string }[] = [];
  projectBatch: any;
  infor: any;
  itemDetail: any;

  constructor(
    private _service: PersonalProjectManagementService,
    private _fileService: FileService,
    protected _injector: Injector,
    private _sericeProjectBatch: ProjectBatchService,
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
        header: 'Họ và tên',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'email',
        header: 'Email',
        visible: true,
        sort: false,
        width: 13,
      },
      {
        field: 'phoneNumber',
        header: 'Số điện thoại',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'nameTeacher',
        header: 'Giảng viên hướng dẫn',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'nameProjectBatch',
        header: 'Đợt đồ án',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'topicName',
        header: 'Tên chủ đề',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'projectName',
        header: 'Tên đề tài',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'status',
        header: 'Trạng thái',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'resources',
        header: 'Tài liệu đồ án',
        visible: true,
        sort: false,
        width: 20,
      },
      // {
      //   field: 'action',
      //   header: 'Hành động',
      //   visible: true,
      //   sort: false,
      //   width: 20,
      // },
    ];
    this.formGroup = new UntypedFormGroup({
      keyword: new UntypedFormControl(''),
      projectBatch: new UntypedFormControl(''),
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
    this.orderCol = 'Id';
    this.infor = JSON.parse(localStorage.getItem('id_token_claims_obj'));
  }
  async ngOnInit() {
    this.getAllProjectBatch();
    this.search();
    this.getDataInfor();
  }

  getAllProjectBatch() {
    this._sericeProjectBatch.getAllProjectsBatch().then((rs) => {
      if (rs.success) {
        this.listprojectBatch = rs?.data?.map((r) => ({
          label: `${r.name}`,
          value: r.id,
        }));
        this.projectBatch = this.listprojectBatch[0]?.value;
      } else {
        this.listprojectBatch = [];
      }
    });
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
      idProjectBatch: this.projectBatch,
      idUser: this.infor.userid,
    };
    this.isLoading = true;
    this._service
      .getsPersonalProjectManagement(model)
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

  getDataInfor() {
    const model = {
      idUser: this.infor.userid,
    };
    this._service.getPersonalProjectManagementById(model).then(
      (response) => {
        this.itemDetail = response.data;
      },
      (error) => {
        this._notifierService.showError('Có lỗi xảy ra khi lấy dữ liệu');
      }
    );
  }

  downloadFile(item: any, type: any) {
    if (!item) return;

    let filePath = '';
    let fileName = '';

    if (type == 'pdf') {
      filePath = item.pathPDF;
      fileName = item.namePDF;
    } else if (type == 'ppt') {
      filePath = item.pathPPT;
      fileName = item.namePPT;
    } else {
      filePath = item.pathSource;
      fileName = item.nameSource;
    }

    this._fileService.getFiles(filePath).subscribe({
      next: (blob) => {
        // if (blob.size > 5242880) {
        //   // 5MB
        //   this._notifierService.showWarning(
        //     'File tải xuống vượt quá 5MB. Vui lòng thử lại!'
        //   );
        //   return;
        // }

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

  onView(item: any) {
    this.pView.showPopup();
    // if (item.id > 0) {
    // }
  }

  onDelete(item: any) {
    if (item && item.id) {
      this._notifierService
        .showConfirm('Bạn có chắc muốn xoá tài liệu tham khảo này không?')
        .then((res) => {
          // if (res) {
          //   this._service.deleteReferencesFile(item.id).then(
          //     (response) => {
          //       this._notifierService.showDeleteDataSuccess();
          //       this.getData();
          //     },
          //     (error) => {
          //       this._notifierService.showDeleteDataError();
          //     }
          //   );
          // }
        });
    }
  }
}
