import { Component, Injector, OnInit } from '@angular/core';
import { NotificationIsRead, NotificationService, SecondPageIndexBase } from 'vnpost-shared';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent extends SecondPageIndexBase implements OnInit {
  notificationIsRead = NotificationIsRead
  constructor(
    private _notificationService: NotificationService,
    protected _injector: Injector,
  ) {
    super(_notificationService, _injector);
  }
  dataSource = []
  isRead = 0;
  opsIsread = [
    { label: this._translateService.instant('Notification.Readed'), value: this.notificationIsRead.Readed },
    { label: this._translateService.instant('Notification.UnRead'), value: this.notificationIsRead.UnRead },
    { label: this._translateService.instant('LIST.DROPDOWN_ALL'), value: 0 },
  ];
  ngOnInit() {
    this.getData();
  }
  getData() {
    this._notificationService.getsMyNotification(this.pageIndex, this.pageSize, this.isRead).then(rs => {
      if (rs.success) {
        this.dataSource = rs.data;
        this.totalRecord = rs.totalRecord;
      }
    })
  }

  readItem(item) {
    item.isRead = 1;
    this._notificationService.readMessage(item.toId).then(rs => {
    });
  }

}
