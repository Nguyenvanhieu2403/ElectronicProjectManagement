import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { SecondPageIndexBase } from 'vnpost-shared';
import { AddPersonalProjectManagementComponent } from '../personal-project-management/add-personal-project-management/add-personal-project-management.component';
import { ViewPersonalProjectManagementComponent } from '../personal-project-management/view-personal-project-management/view-personal-project-management.component';
import { EditReferencesFileManagerComponent } from '../references-file-manager/edit-references-file-manager/edit-references-file-manager.component';
import { FileService } from '../service/file.service';
import { PersonalProjectManagementService } from '../service/personal-project-management.service';
import { ProjectBatchService } from '../service/project-batch.service';
import { finalize } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-project-approval',
  templateUrl: './project-approval.component.html',
  styleUrls: ['./project-approval.component.css'],
})
export class ProjectApprovalComponent
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
  setWidth: string = '250%';
  dataMotion: any;
  keyword: any;
  listprojectBatch: { label: string; value: string }[] = [];
  projectBatch: any;
  infor: any;
  itemDetail: any;
  isShow: boolean = false;
  contentDuplicated: any;
  reasonReject: any;
  isReject: boolean = false;

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
        field: 'plagiarismRate',
        header: 'Tỷ lệ đạo văn cao nhất',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'targetFile',
        header: 'File mục tiêu',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'fileHighestRatio',
        header: 'File đạo văn cao nhất',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'contentDuplicated',
        header: 'Nội dung trùng lặp',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'timeCheck',
        header: 'Thời gian kiểm tra',
        visible: true,
        sort: false,
        width: 20,
      },
      {
        field: 'testType',
        header: 'Loại kiểm tra',
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
      reasonReject: new UntypedFormControl('', [Validators.required]),
    });
    this.orderCol = 'Id';
    this.infor = JSON.parse(localStorage.getItem('id_token_claims_obj'));
  }
  async ngOnInit() {
    this.getAllProjectBatch();
    this.search();
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
      .getsPersonalProjectManagementApprovalBySearch(model)
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
      idProjectBatch: this.projectBatch,
      idUser: this.infor.userid,
    };
    const date = new Date();
    const dateStr = `${date.getDate().toString().padStart(2, '0')}_${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}_${date.getFullYear()}`;
    this.isLoading = true;
    this._service.getsPersonalProjectManagementApprovalExportExcel(model)
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe((blob) => {
      saveAs(blob, `Danhsachdoancanpheduyet_${dateStr}.xlsx`);
    });
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

  downloadFileHighestRatio(item: any) {
    if (!item) return;
    
    const fileName = item.fileHighestRatio;
    
    this._fileService.getFiles("D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File\\ReferencesFile\\" +fileName).subscribe({
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

  onView(item: any) {
    this.contentDuplicated = item.contentDuplicated;
    this.isShow = true;
  }

  projectApproval(item: any, status: any) {
    if (item.status == 1) {
      this._notifierService.showWarning('Đồ án đã được phê duyệt');
      return;
    }

    if (item.status == 2) {
      this._notifierService.showWarning('Đồ án đã bị từ chối');
      return;
    }

    if (item && item.idProjectsTeachersStudents) {
      this._notifierService
        .showConfirm('Bạn có chắc muốn phê duyệt đồ án này không?')
        .then((res) => {
          if (res) {
            this._service
              .projectApproval(item.idProjectsTeachersStudents, status)
              .then(
                (response) => {
                  this._notifierService.showSuccess('Phê duyệt thành công');
                  this.getData();
                },
                (error) => {
                  this._notifierService.showError('Phê duyệt thất bại');
                }
              );
          }
        });
    }
  }

  rejectProjectDialog(item: any) {
    this.itemDetail = item;
    this.reasonReject = '';
    this.isReject = true;
  }

  rejectProject(status: any) {
    if (this.itemDetail.status == 2) {
      this._notifierService.showWarning('Đồ án đã bị từ chối');
      return;
    }

    if (this.itemDetail && this.itemDetail.idProjectsTeachersStudents) {
      this._notifierService
        .showConfirm('Bạn có chắc muốn từ chối đồ án này không?')
        .then((res) => {
          if (res) {
            this._service
              .rejectProject(
                this.itemDetail.idProjectsTeachersStudents,
                2,
                this.reasonReject
              )
              .then(
                (response) => {
                  this._notifierService.showSuccess('Từ chối thành công');
                  this.isReject = false;
                  this.getData();
                },
                (error) => {
                  this._notifierService.showError('Từ chối thất bại');
                }
              );
          }
        });
    }
  }

  downloadReportCheckPlagiarism(item: any) {
    this._notifierService.showSuccess(`Bắt đầu kiểm tra đạo văn đề tài ${item.projectName}`);
    if (!item) return;
    this._service
      .downloadReportCheckPlagiarism(item.idProjectsTeachersStudents)
      .subscribe((blob) => {
        const fileName = `ReportCheckPlagiarism_${item.nameStudent}_${item.projectName}.pdf`;
        saveAs(blob, fileName);
        this._notifierService.showSuccess(`Tải xuống thành công ${fileName}`);
      }, (error) => {
        console.error('Lỗi khi tải file:', error);
        this._notifierService.showError('Không thể tải file. Vui lòng thử lại!');
      });
  }
}
