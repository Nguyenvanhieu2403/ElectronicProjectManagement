import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { SecondPageIndexBase } from 'vnpost-shared';
import { Template1FormComponent } from '../form/template1-form.component';
import { TemplateApiService } from '../services/template-api.service';

@Component({
  selector: 'app-template1-index',
  templateUrl: './template1-index.component.html',
  styleUrls: ['./template1-index.component.css']
})
export class Template1IndexComponent extends SecondPageIndexBase implements OnInit {

  @ViewChild('pEdit') pEdit: Template1FormComponent;

  constructor(
    protected _templateApiService: TemplateApiService,
    protected _injector: Injector,
    public app: AppComponent,
  ) {
    super(_templateApiService, _injector);
  }

  ngOnInit() {

    this.cols = [
      { field: 'code', header: this._translateService.instant('FORM.CODE'), visible: true, width: 'auto', },
      { field: 'title', header: this._translateService.instant('FORM.TITLE'), visible: true, width: 'auto', },
      { field: 'modified', header: this._translateService.instant('TABLEDATA.MODIFIED'), visible: true, width: 'auto', sort: true, dateFormat: 'dd/MM/yyyy HH:mm' },
      { field: 'modifiedByName', header: this._translateService.instant('TABLEDATA.MODIFIED_BY'), visible: true, width: 'auto' },
    ];
    this.getData();
  }

  edit() {
    this.pEdit.showPopup(this.selectedItems[0].id);
  }

  add() {
    this.pEdit.showPopup();
  }

  getData() {
    this.dataSource = [
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
    ];
    this.totalRecord = this.dataSource.length;
  }
}
