import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { SecondPageIndexBase } from 'vnpost-shared';
import { AzRoleMappingUsersFormComponent } from '../form/form.component';
import { AzRoleMappingUsersService } from '../../../services/az-role-mapping-users.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-azrolemappingusers-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class AzRoleMappingUsersIndexComponent extends SecondPageIndexBase implements OnInit {

  popupSize: any = { width: '1170' };
  @ViewChild('pEdit') pEdit: AzRoleMappingUsersFormComponent;

  constructor(
    protected _azrolemappingusersService: AzRoleMappingUsersService,
    protected _injector: Injector,
    public app: AppComponent
  ) {
    super(_azrolemappingusersService, _injector);
  }

  async ngOnInit() {

    this.cols = [
      { field: 'userName', header: this._translateService.instant('Users.userName'), width: '10%', visible: true, sort: true, },
      { field: 'displayName', header: this._translateService.instant('Users.displayName'), width: '10%', visible: true, },
      { field: 'email', header: 'Email', visible: true, width: '10%' },
      { field: 'dsAzRoleMappingUser', header: this._translateService.instant('AzRoles.Title'), width: '60%', visible: true, },
    ];
    this.getData();
  }



  edit() {
    this.pEdit.showPopup({ itemId: this.selectedItems[0].id, });
  }

  add() {
    this.pEdit.showPopup({ itemId: 0, });
  }

  getData(limit?: number) {
    this.isLoading = true;
    var model = {
      unitCode: this.currentUser.unitCode,
      keyword: this.query,
      status: this.status,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      orderCol: this.orderCol,
      isDesc: this.isDesc,
    }
    this._azrolemappingusersService.find(model)
      .then(response => {
        this.dataSource = response.data;

        if (response.totalRecord || response.totalRecord === 0) {
          this.totalRecord = response.totalRecord;
        }

        this.afterGetData();
        this.isLoading = false;
      }, error => {
        this._notifierService.showHttpUnknowError();
        this.isLoading = false;
      });
  }
}
