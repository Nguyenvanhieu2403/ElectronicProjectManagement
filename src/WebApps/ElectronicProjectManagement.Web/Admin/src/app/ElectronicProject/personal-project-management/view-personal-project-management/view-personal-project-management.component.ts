import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase } from 'vnpost-shared';
import { ConvertTimezoneService } from '../../service/convert-timezone.service';
import { PersonalProjectManagementService } from '../../service/personal-project-management.service';
import { FileService } from '../../service/file.service';

@Component({
  selector: 'app-view-personal-project-management',
  templateUrl: './view-personal-project-management.component.html',
  styleUrls: ['./view-personal-project-management.component.css'],
})
export class ViewPersonalProjectManagementComponent
  extends SecondPageEditBase
  implements OnInit
{
  src = '';
  height = 100;
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
    this.src =
      'D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File\\Upload\\PDF\\BaoCaoTTTN_20327_4.pdf';
  }

  async onShowPopup() {
    this.resetForm();
    this.infor = JSON.parse(localStorage.getItem('id_token_claims_obj'));
    this.getDataInfor();
  }

  getDataInfor() {
    const model = {
      idUser: this.infor.userid,
    };
    this._service.getPersonalProjectManagementById(model).then(
      (response) => {
        this.itemDetail = response.data;
        const filePath = this.itemDetail.pathPDF;
        const fileName = this.itemDetail.namePDF;

        this.getFilePDF();
      },
      (error) => {
        this._notifierService.showError('Có lỗi xảy ra khi lấy dữ liệu');
      }
    );
  }

  getFilePDF() {
    let filePath = this.itemDetail.pathPDF;
    const fileName = this.itemDetail.namePDF;

    console.log(this._fileService.getPdf(filePath));
  }
}
