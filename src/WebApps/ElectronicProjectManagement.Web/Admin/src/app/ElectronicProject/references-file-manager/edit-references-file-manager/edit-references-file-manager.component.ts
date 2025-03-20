import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase } from 'vnpost-shared';
import { ConvertTimezoneService } from '../../service/convert-timezone.service';
import { ReferencesFileManagerService } from '../../service/references-file-manager.service';
import { environment } from '../../../../environments/environment';
import { FileService } from '../../service/file.service';

@Component({
  selector: 'app-edit-references-file-manager',
  templateUrl: './edit-references-file-manager.component.html',
  styleUrls: ['./edit-references-file-manager.component.css'],
})
export class EditReferencesFileManagerComponent
  extends SecondPageEditBase
  implements OnInit
{
  uploadedFile: File | null = null;
  fileDownloadUrl: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    protected _service: ReferencesFileManagerService,
    private _timerService: ConvertTimezoneService,
    private _fileService: FileService,
    protected _injector: Injector
  ) {
    super(_service, _injector);
    this.formGroup = new UntypedFormGroup({
      title: new UntypedFormControl('', [Validators.required]),
      author: new UntypedFormControl('', [Validators.required]),
      documentType: new UntypedFormControl('', [Validators.required]),
      yearPublication: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
      field: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit() {}

  onShowPopup(Id: any) {
    this.validationSummary.resetErrorMessages();
    this.resetForm();

    if (Id > 0) {
      this._service.getById(Id).then(
        (response) => {
          this.itemDetail = response.data;
          this.itemDetail.yearPublication = new Date(
            this.itemDetail.yearPublication
          );
          const filePath = this.itemDetail.path;
          const fileName = this.itemDetail.fileName;

          this._fileService.getFiles(filePath).subscribe({
            next: (blob) => {
              // if (blob.size > 5242880) { // 5MB
              //   this._notifierService.showWarning("File tải xuống vượt quá 5MB. Vui lòng thử lại!");
              //   return;
              // }

              // Tạo đối tượng File
              const file = new File([blob], fileName, { type: blob.type });
              this.selectedFile = file;

              // Đọc file và tạo URL để tải xuống
              const fileReader = new FileReader();
              fileReader.onload = () => {
                const downloadBlob = new Blob(
                  [fileReader.result as ArrayBuffer],
                  { type: file.type }
                );
                this.fileDownloadUrl = URL.createObjectURL(downloadBlob);
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
        },
        (error) => {
          if (error?.error?.message)
            this._notifierService.showError(error?.error?.message);
          else
            this._notifierService.showWarning(
              this._translateService.instant('MESSAGE.NOT_FOUND_ERROR')
            );
        }
      );
    }
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
    if (!this.selectedFile) {
      this._notifierService.showError('Vui lòng chọn file');
      this.submitting = false;
      return;
    }

    this.itemDetail.yearPublication = this._timerService.formatFullDateDotNet(
      this.itemDetail.yearPublication
    );

    const model = this.itemDetail;
    delete model.createDate;
    delete model.createBy;
    delete model.modified;
    delete model.modifiedBy;

    this._service.updateReferencesFile(model, this.selectedFile).then(
      (response) => {
        this.closePopupMethod(true);
        this._notifierService.showUpdateDataSuccess();
        this.onAfterSave();
        this.submitting = false;
      },
      (error) => {
        this.submitting = false;
        if (error.error.message)
          this._notifierService.showError(error.error.message);
        else this._notifierService.showError('Có lỗi xảy ra khi chỉnh sửa');
      }
    );
  }

  onFileSelect(event: any): void {
    this.selectedFile = event.files[0];
    if (this.selectedFile) {
      // Kiểm tra kích thước file
      // if (this.selectedFile.size > 5242880) { // 5MB
      //   this._notifierService.showWarning("File upload chỉ được dưới 5MB.Tải lại file!");
      //   return;
      // }
      this.uploadedFile = this.selectedFile;
      // Tạo URL blob để tải xuống
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const blob = new Blob([fileReader.result as ArrayBuffer], {
          type: this.selectedFile.type,
        });
        this.fileDownloadUrl = URL.createObjectURL(blob);
      };
      fileReader.readAsArrayBuffer(this.selectedFile);
      // this.onUpload()
    }
  }

  removeFile(fileInput: any) {
    this.selectedFile = null;
    this.fileDownloadUrl = null;
    fileInput.clear();
  }
}
