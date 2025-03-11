import { Component, Injector, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SecondPageEditBase } from 'vnpost-shared';
import { UnitService } from '../../../../core/services/unit-service';
import { ConvertTimezoneService } from '../../../service/convert-timezone.service';
import { TopicManagerService } from '../../../service/topic-manager.service';
import { ProjectBatchService } from '../../../service/project-batch.service';

@Component({
  selector: 'app-view-project-batch',
  templateUrl: './view-project-batch.component.html',
  styleUrls: ['./view-project-batch.component.css'],
})
export class ViewProjectBatchComponent
  extends SecondPageEditBase
  implements OnInit
{
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecord: number = 0;
  cols: any[] = [
    { field: 'stt', header: 'STT', visible: true },
    { field: 'displayName', header: 'Họ và tên', visible: true },
    { field: 'email', header: 'Email', visible: true },
    { field: 'phoneNumber', header: 'Số điện thoại', visible: true },
    { field: 'unitName', header: 'Đơn vị', visible: true },
  ];
  dataSource: any[] = [];
  setWidth: string = '100%';
  isLoading: boolean = false;
  title: any;
  itemSelected: any;

  constructor(
    protected _service: ProjectBatchService,
    private _timerService: ConvertTimezoneService,
    private _unitService: UnitService,
    protected _injector: Injector
  ) {
    super(_service, _injector);
    this.formGroup = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      unitCode: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit() {}

  onShowPopup(item: any) {
    if (item && item.type === 1) {
      this.title = 'Danh sách giảng viên';
    }
    if (item && item.type === 2) {
      this.title = 'Danh sách sinh viên';
    }
    this.resetForm();
    this.totalRecord = 0;
    this.pageIndex = 1;

    if (item && item.id > 0) {
      this.itemSelected = item;
      this.getList();
    }
  }

  getList() {
    const model = {
      id: this.itemSelected.id,
      type: this.itemSelected.type,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    };
    this._service.getsUserByProjectBatchId(model).then(
      (res) => {
        this.dataSource = res?.data;
        this.totalRecord = res?.totalRecord;
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

  onPrePage() {
    this.pageIndex--;
    this.getList();
  }

  onNextPage() {
    this.pageIndex++;
    this.getList();
  }

  resetColsVisibility() {
    this.cols.forEach((col) => {
      col.visible = true;
    });
  }

  onPage(event: any) {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.getList();
  }
}
