import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { SecondPageEditBase } from 'vnpost-shared';
import { ProjetcManagerService } from '../../../service/projetc-manager.service';

@Component({
  selector: 'app-import-project-manager',
  templateUrl: './import-project-manager.component.html',
  styleUrls: ['./import-project-manager.component.css'],
})
export class ImportProjectManagerComponent
  extends SecondPageEditBase
  implements OnInit
{
  @ViewChild('fileInput') fileInput!: FileUpload;
  uploadedFile: File | null = null;
  fileDownloadUrl: string | null = null;

  constructor(
    protected _service: ProjetcManagerService,
    protected _injector: Injector
  ) {
    super(_service, _injector);
  }

  ngOnInit() {}

  onShowPopup() {
    // this.validationSummary.resetErrorMessages();
    this.resetForm();
    this.uploadedFile = null;
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      if (file.size > 5242880) {
        this._notifierService.showWarning(
          'File upload chỉ được dưới 5MB.Tải lại file!'
        );
        return;
      }
      this.uploadedFile = file;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const blob = new Blob([fileReader.result as ArrayBuffer], {
          type: file.type,
        });
        this.fileDownloadUrl = URL.createObjectURL(blob);
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  removeFile(fileInput: any) {
    this.uploadedFile = null;
    this.fileDownloadUrl = null;
    fileInput.clear();
  }

  onUpload() {
    if (!this.uploadedFile) {
      this._notifierService.showWarning('Vui lòng chọn 1 file!');
      return;
    }
    this._service
      .importProjects(this.uploadedFile)
      .then((response) => {
        this.closePopupMethod(true);
        console.log(response);
        // this._notifierService.showInsertDataSuccess();
        this._notifierService.showSuccess(response?.message);
        this.uploadedFile = null;
        this.fileDownloadUrl = null;
        this.fileInput.clear();
        this.onAfterSave();
        this.submitting = false;
      })
      .catch((error) => {
        if (error?.error?.message) {
          this._notifierService.showError(error?.error?.message);
        } else {
          this._notifierService.showInsertDataFailed();
        }
        this.submitting = false;
      });
  }

  downloadTemplate() {
    const link = document.createElement('a');
    link.href = './assets/template/ImportProjetcs.xlsx'; // Đường dẫn tới file mẫu
    link.download = 'File mẫu import đề tài đồ án.xlsx'; // Tên file khi tải xuống
    link.click();
  }
}
