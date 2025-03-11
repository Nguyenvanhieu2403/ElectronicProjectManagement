import { Component, Injector, OnInit } from '@angular/core';
import { StudentRegisterProjectService } from '../../service/student-register-project.service';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase, UserService } from 'vnpost-shared';
import { UnitService } from '../../../core/services/unit-service';
import { ConvertTimezoneService } from '../../service/convert-timezone.service';
import { ProjetcManagerService } from '../../service/projetc-manager.service';
import { TopicManagerService } from '../../service/topic-manager.service';

@Component({
  selector: 'app-add-student-register-project',
  templateUrl: './add-student-register-project.component.html',
  styleUrls: ['./add-student-register-project.component.css'],
})
export class AddStudentRegisterProjectComponent
  extends SecondPageEditBase
  implements OnInit
{
  listTopic: { label: string; value: string }[] = [];
  infor: any;

  constructor(
    protected _service: ProjetcManagerService,
    private _timerService: ConvertTimezoneService,
    private _topicService: TopicManagerService,
    protected _injector: Injector
  ) {
    super(_service, _injector);
    this.formGroup = new UntypedFormGroup({
      topic: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
    });
    this.infor = JSON.parse(localStorage.getItem('id_token_claims_obj'));
  }

  ngOnInit() {
    this.getListTopic();
  }

  onShowPopup() {
    this.validationSummary.resetErrorMessages();
    this.resetForm();

    this.onReset();

    this.itemDetail.id = 0;
    this.itemDetail.status = '1';
    this.getListTopic();
  }

  getListTopic() {
    this._topicService.getsAll().then((rs) => {
      if (rs.success) {
        this.listTopic = rs?.data?.map((r) => ({
          label: `- ${r.name}`,
          value: r.id,
        }));
      } else {
        this.listTopic = [];
      }
    });
  }

  async save() {
    if (this.formGroup.invalid) {
      this.submitting = false;
      this.validationSummary.showValidationSummary();
      return;
    }
    this.onInsert();
  }
  async onInsert() {
    var title = `Sau khi đề xuất đề tài, giảng viên sẽ xem xét và quyết định chấp nhận hoặc không chấp nhận.<br>
                 Kết quả sẽ được gửi về email <strong>${this.infor.email}</strong> của bạn.<br>
                 Bạn có chắc chắn muốn đề xuất đề tài này không?`;
    this._notifierService.showConfirm(title).then((res) => {
      if (res) {
        this.submitting = true;
        const model = this.itemDetail;
        this._service.proposeProjects(model).then(
          (response) => {
            this.closePopupMethod(true);
            this._notifierService.showSuccess(
              'Đề xuất đề tài thành công, vui lòng chờ giảng viên phê duyệt'
            );
            this.onAfterSave();
            this.submitting = false;
          },
          (error) => {
            this.submitting = false;
            if (error.error.message)
              this._notifierService.showError(error.error.message);
            else
              this._notifierService.showError(
                'Có lỗi xảy ra khi đề xuất đề tài'
              );
          }
        );
      }
    });
  }
}
