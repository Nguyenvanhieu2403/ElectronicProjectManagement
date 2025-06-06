import { Component, Injector, model, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { SecondPageEditBase } from 'vnpost-shared';
import { ReferencesFileManagerService } from '../../service/references-file-manager.service';
import { ConvertTimezoneService } from '../../service/convert-timezone.service';

@Component({
  selector: 'app-add-references-file-manager',
  templateUrl: './add-references-file-manager.component.html',
  styleUrls: ['./add-references-file-manager.component.css']
})
export class AddReferencesFileManagerComponent extends SecondPageEditBase implements OnInit {

  uploadedFile: File | null = null;
  fileDownloadUrl: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    protected _service: ReferencesFileManagerService,
    private _timerService: ConvertTimezoneService,
    protected _injector: Injector
  ) {
    super(_service, _injector);
    this.formGroup = new UntypedFormGroup({
      title: new UntypedFormControl('', [Validators.required]),
      // author: new UntypedFormControl('', [Validators.required]),
      // documentType: new UntypedFormControl('', [Validators.required]),
      // yearPublication: new UntypedFormControl('', [Validators.required]),
      // description: new UntypedFormControl('', [Validators.required]),
      // field: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit() { }

  onShowPopup() {
    this.validationSummary.resetErrorMessages();
    this.resetForm();

    this.onReset();

    this.itemDetail.id = 0;
    this.itemDetail.status = '1';
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

    this.itemDetail.yearPublication = this._timerService.formatFullDateDotNet(this.itemDetail.yearPublication);

    const model = this.itemDetail;
    
    this._service.addReferencesFile(model, this.selectedFile).then(
      (response) => {
        this.closePopupMethod(true);
        this._notifierService.showInsertDataSuccess();
        this.onAfterSave();
        this.submitting = false;
      },
      (error) => {
        this.submitting = false;
        if (error.error.message)
          this._notifierService.showError(error.error.message);
        else this._notifierService.showError('Có lỗi xảy ra khi thêm mới');
      },
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
        const blob = new Blob([fileReader.result as ArrayBuffer], { type: this.selectedFile.type });
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
