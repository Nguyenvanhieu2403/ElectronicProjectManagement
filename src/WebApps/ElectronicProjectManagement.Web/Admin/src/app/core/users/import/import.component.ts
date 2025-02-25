import { Component, OnInit, ViewChild, Injector } from '@angular/core';

import { SecondPageEditBase, UserService, ExportService } from 'vnpost-shared';
import { FileUpload } from 'primeng/fileupload';
import { UserTypeId } from '../../../config/enums';
import { saveAs } from 'file-saver';
import { CoreUserService } from '../../services/core-user.service';

@Component({
  selector: 'app-users-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class UsersImportComponent extends SecondPageEditBase implements OnInit {
  @ViewChild('fileControl') fileControl: FileUpload;
  rawFileName = '';
  isUploading = false;
  dataSource = [];
  cols = [];
  dataError = [];
  constructor(
    protected _userService: UserService,
    protected _injector: Injector,
    protected _exportService: ExportService
  ) {
    super(_userService, _injector);
  }

  ngOnInit() {
    this.cols = [
      {
        field: 'userName',
        header: this._translateService.instant('Users.userName'),
        visible: true,
        sort: true,
      },
      {
        field: 'displayName',
        header: this._translateService.instant('Users.displayName'),
        visible: true,
        sort: true,
      },
      {
        field: 'email',
        header: this._translateService.instant('Users.email'),
        visible: true,
        sort: true,
      },
      {
        field: 'phoneNumber',
        header: this._translateService.instant('Users.phoneNumber'),
        visible: true,
      },
      {
        field: 'unitCode',
        header: this._translateService.instant('Users.unitCode'),
        visible: true,
      },
    ];
  }

  myUploader(event) {
    const files = event.files;
    if (files.length > 0) {
      this.submitting = true;
      this.isUploading = true;
      this.rawFileName = files[0].name;
      const formData: FormData = new FormData();
      formData.append(this.rawFileName, files[0]);
      this._userService
        .importUsers(formData)
        .then((rs) => {
          if (rs.success) {
            this.dataSource = rs.data.data;
            this.dataError = rs.data.dataError;
          } else {
            this._notifierService.showHttpUnknowError();
          }
          this.submitting = false;
          this.isUploading = false;
        })
        .catch((err) => {
          console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
          this.submitting = false;
          this.isUploading = false;
        });
    }
  }
  onShowPopup(data: any) {
    this.dataError = [];
    this.dataSource = [];
  }
  onUpload() {
    this.fileControl.upload();
  }
  onImport() {
    if (this.dataSource.length > 0) {
      this.submitting = true;
      this._userService
        .insertMany(this.dataSource)
        .then((rs) => {
          if (rs.success) {
            this._notifierService.showInsertDataSuccess();
            this.closePopupMethod(true);
          } else {
            this._notifierService.showHttpUnknowError();
          }
          this.submitting = false;
        })
        .catch((err) => {
          console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
          this.submitting = false;
        });
    } else {
    }
  }
  downloadForm() {
    this._userService.getTemplateImportUsers();
  }
}
