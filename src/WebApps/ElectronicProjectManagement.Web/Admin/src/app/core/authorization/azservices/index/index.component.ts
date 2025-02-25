import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { SecondPageIndexBase } from 'vnpost-shared';
import { AzServicesFormComponent } from '../form/form.component';
import { AzServicesService } from '../../../services/azservices.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-azservices-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class AzServicesIndexComponent extends SecondPageIndexBase implements OnInit {

  @ViewChild('pEdit') pEdit: AzServicesFormComponent;

  constructor(
    protected _servicesService: AzServicesService,
    protected _injector: Injector,
    public app: AppComponent,
  ) {
    super(_servicesService, _injector);
  }

  ngOnInit() {

    this.cols = [
      { field: 'code', header: this._translateService.instant('FORM.CODE'), visible: true, width: 'auto', },
      { field: 'title', header: this._translateService.instant('FORM.TITLE'), visible: true, width: 'auto', },
      { field: 'description', header: this._translateService.instant('FORM.DESCRIPTION'), visible: true, width: 'auto', },
      { field: 'modified', header: this._translateService.instant('TABLEDATA.MODIFIED'), visible: false, width: 'auto', sort: true, dateFormat: 'dd/MM/yyyy HH:mm' },
      { field: 'modifiedByName', header: this._translateService.instant('TABLEDATA.MODIFIED_BY'), visible: false, width: 'auto' },
    ];
    this.getData();
  }

  edit() {
    const item = this.selectedItems[0];
    this.pEdit.showPopup(item.id);
  }

  add() {
    this.pEdit.showPopup();
  }
}
