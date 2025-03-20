import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase } from 'vnpost-shared';
import { ConvertTimezoneService } from '../../service/convert-timezone.service';
import { ReferencesFileManagerService } from '../../service/references-file-manager.service';
import { PersonalProjectManagementService } from '../../service/personal-project-management.service';
import { FileService } from '../../service/file.service';

@Component({
  selector: 'app-add-personal-project-management',
  templateUrl: './add-personal-project-management.component.html',
  styleUrls: ['./add-personal-project-management.component.css'],
})
export class AddPersonalProjectManagementComponent
  extends SecondPageEditBase
  implements OnInit
{
  uploadedFilePDF: File | null = null;
  fileDownloadUrlPDF: string | null = null;
  selectedFilePDF: File | null = null;

  uploadedFilePPT: File | null = null;
  fileDownloadUrlPPT: string | null = null;
  selectedFilePPT: File | null = null;

  uploadedFileSource: File | null = null;
  fileDownloadUrlSource: string | null = null;
  selectedFileSource: File | null = null;
  infor: any;

  constructor(
    protected _service: PersonalProjectManagementService,
    private _fileService: FileService,
    private _timerService: ConvertTimezoneService,
    protected _injector: Injector
  ) {
    super(_service, _injector);
    this.formGroup = new UntypedFormGroup({
      nameProjectBatch: new UntypedFormControl('', [Validators.required]),
      topicName: new UntypedFormControl('', [Validators.required]),
      projectName: new UntypedFormControl('', [Validators.required]),
    });
    this.infor = JSON.parse(localStorage.getItem('id_token_claims_obj'));
  }

  ngOnInit() {
    this.getDataInfor();
    this.infor = JSON.parse(localStorage.getItem('id_token_claims_obj'));
  }

  onShowPopup() {
    this.validationSummary.resetErrorMessages();
    this.resetForm();

    this.onReset();

    this.itemDetail.id = 0;
    this.itemDetail.status = '1';
    this.getDataInfor();
    this.infor = JSON.parse(localStorage.getItem('id_token_claims_obj'));
  }

  getDataInfor() {
    const model = {
      idUser: this.infor.userid,
    };
    this._service.getPersonalProjectManagementById(model).then(
      (response) => {
        if (response.data?.nameProjectBatch) {
          this.itemDetail = response.data;
          if (this.itemDetail.namePDF) {
            this.getFilePDF(this.itemDetail.pathPDF, this.itemDetail.namePDF);
          }
          if (this.itemDetail.namePPT) {
            this.getFilePPT(this.itemDetail.pathPPT, this.itemDetail.namePPT);
          }
          if (this.itemDetail.nameSource) {
            this.getFileSource(
              this.itemDetail.pathSource,
              this.itemDetail.nameSource
            );
          }
        }
      },
      (error) => {
        this._notifierService.showError('Có lỗi xảy ra khi lấy dữ liệu');
      }
    );
  }

  getFilePDF(filePath: any, fileName: any) {
    this._fileService.getFiles(filePath).subscribe({
      next: (blob) => {
        // if (blob.size > 5242880) { // 5MB
        //   this._notifierService.showWarning("File tải xuống vượt quá 5MB. Vui lòng thử lại!");
        //   return;
        // }

        // Tạo đối tượng File
        const file = new File([blob], fileName, { type: blob.type });
        this.selectedFilePDF = file;

        // Đọc file và tạo URL để tải xuống
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const downloadBlob = new Blob([fileReader.result as ArrayBuffer], {
            type: file.type,
          });
          this.fileDownloadUrlPDF = URL.createObjectURL(downloadBlob);
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

  getFilePPT(filePath: any, fileName: any) {
    this._fileService.getFiles(filePath).subscribe({
      next: (blob) => {
        // if (blob.size > 5242880) { // 5MB
        //   this._notifierService.showWarning("File tải xuống vượt quá 5MB. Vui lòng thử lại!");
        //   return;
        // }

        // Tạo đối tượng File
        const file = new File([blob], fileName, { type: blob.type });
        this.selectedFilePPT = file;

        // Đọc file và tạo URL để tải xuống
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const downloadBlob = new Blob([fileReader.result as ArrayBuffer], {
            type: file.type,
          });
          this.fileDownloadUrlPPT = URL.createObjectURL(downloadBlob);
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

  getFileSource(filePath: any, fileName: any) {
    this._fileService.getFiles(filePath).subscribe({
      next: (blob) => {
        // if (blob.size > 5242880) { // 5MB
        //   this._notifierService.showWarning("File tải xuống vượt quá 5MB. Vui lòng thử lại!");
        //   return;
        // }

        // Tạo đối tượng File
        const file = new File([blob], fileName, { type: blob.type });
        this.selectedFileSource = file;

        // Đọc file và tạo URL để tải xuống
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const downloadBlob = new Blob([fileReader.result as ArrayBuffer], {
            type: file.type,
          });
          this.fileDownloadUrlSource = URL.createObjectURL(downloadBlob);
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
    // if (this.itemDetail.namePDF) {
    //   this._notifierService.showError('Mỗi sinh viên chỉ được tải lên 1 đồ án');
    //   this.submitting = false;
    //   return;
    // }

    if (!this.selectedFilePDF) {
      this._notifierService.showError('Vui lòng chọn file PDF');
      this.submitting = false;
      return;
    }

    if (!this.selectedFilePPT) {
      this._notifierService.showError('Vui lòng chọn file PPT');
      this.submitting = false;
      return;
    }

    if (!this.selectedFileSource) {
      this._notifierService.showError('Vui lòng chọn file nguồn');
      this.submitting = false;
      return;
    }

    const model = {
      idStudent: this.infor.userid,
      idProjectsTeachersStudents: this.itemDetail.idProjectsTeachersStudents,
    };

    this._service
      .uploadPersonalProjectManagement(
        model,
        this.selectedFilePDF,
        this.selectedFilePPT,
        this.selectedFileSource
      )
      .then(
        (response) => {
          this.closePopupMethod(true);
          this._notifierService.showInsertDataSuccess();
          this.onAfterSave();
          this.submitting = false;
          this.getDataInforAfterInssert();
        },
        (error) => {
          this.submitting = false;
          if (error.error.message)
            this._notifierService.showError(error.error.message);
          else this._notifierService.showError('Có lỗi xảy ra khi thêm mới');
        }
      );
  }

  onFileSelectPDF(event: any): void {
    this.selectedFilePDF = event.files[0];
    if (this.selectedFilePDF) {
      // Kiểm tra kích thước file
      // if (this.selectedFile.size > 5242880) { // 5MB
      //   this._notifierService.showWarning("File upload chỉ được dưới 5MB.Tải lại file!");
      //   return;
      // }
      this.uploadedFilePDF = this.selectedFilePDF;
      // Tạo URL blob để tải xuống
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const blob = new Blob([fileReader.result as ArrayBuffer], {
          type: this.selectedFilePDF.type,
        });
        this.fileDownloadUrlPDF = URL.createObjectURL(blob);
      };
      fileReader.readAsArrayBuffer(this.selectedFilePDF);
      // this.onUpload()
    }
  }

  removeFilePDF(fileInput: any) {
    this.selectedFilePDF = null;
    this.fileDownloadUrlPDF = null;
    fileInput.clear();
  }

  onFileSelectPPT(event: any): void {
    this.selectedFilePPT = event.files[0];
    if (this.selectedFilePPT) {
      // Kiểm tra kích thước file
      // if (this.selectedFile.size > 5242880) { // 5MB
      //   this._notifierService.showWarning("File upload chỉ được dưới 5MB.Tải lại file!");
      //   return;
      // }
      this.uploadedFilePPT = this.selectedFilePPT;
      // Tạo URL blob để tải xuống
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const blob = new Blob([fileReader.result as ArrayBuffer], {
          type: this.selectedFilePPT.type,
        });
        this.fileDownloadUrlPPT = URL.createObjectURL(blob);
      };
      fileReader.readAsArrayBuffer(this.selectedFilePPT);
      // this.onUpload()
    }
  }

  removeFilePPT(fileInput: any) {
    this.selectedFilePPT = null;
    this.fileDownloadUrlPPT = null;
    fileInput.clear();
  }

  onFileSelectSource(event: any): void {
    this.selectedFileSource = event.files[0];
    if (this.selectedFileSource) {
      // Kiểm tra kích thước file
      // if (this.selectedFile.size > 5242880) { // 5MB
      //   this._notifierService.showWarning("File upload chỉ được dưới 5MB.Tải lại file!");
      //   return;
      // }
      this.uploadedFileSource = this.selectedFileSource;
      // Tạo URL blob để tải xuống
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const blob = new Blob([fileReader.result as ArrayBuffer], {
          type: this.selectedFileSource.type,
        });
        this.fileDownloadUrlSource = URL.createObjectURL(blob);
      };
      fileReader.readAsArrayBuffer(this.selectedFileSource);
      // this.onUpload()
    }
  }

  removeFileSource(fileInput: any) {
    this.selectedFileSource = null;
    this.fileDownloadUrlSource = null;
    fileInput.clear();
  }

  getDataInforAfterInssert() {
    const model = {
      idUser: this.infor.userid,
    };
    this._service.getPersonalProjectManagementById(model).then(
      (response) => {
        this.itemDetail = response.data;

        const modelCheckPlagiarism = {
          filePath: this.itemDetail.pathPDF,
          idProjectsTeachersStudents:
            this.itemDetail.idProjectsTeachersStudents,
        };
        this._service.checkPlagiarism(modelCheckPlagiarism).then((response) => {
          if (response.data.plagiarismRate > 0) {
            this._notifierService.showWarning(
              'Đồ án của bạn có tỷ lệ trùng lặp là ' +
                response.data.plagiarismRate +
                '%'
            );
          }
        }),
          (error) => {
            this._notifierService.showError(
              'Có lỗi xảy ra khi kiểm tra trùng lặp'
            );
          };
      },
      (error) => {
        this._notifierService.showError('Có lỗi xảy ra khi lấy dữ liệu');
      }
    );
  }
}
