import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, style, transition, animate, AnimationEvent } from '@angular/animations';
import { MegaMenuItem } from 'primeng/api';
import { AppComponent } from '../../app.component';
import { AppMainComponent } from './app.main.component';
import { AuthenticationService, CoreUser, NotificationIsRead, NotificationService, PermissionService, SignalRService, UserService } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  animations: [
    trigger('topbarActionPanelAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.8)' }),
        animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: '*' })),
      ]),
      transition(':leave', [
        animate('.1s linear', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppTopBarComponent {

  constructor(
    public appMain: AppMainComponent,
    public app: AppComponent,
    private _userService: UserService,
    private _authenticationService: AuthenticationService,
    private _signalRService: SignalRService,
    private _notificationService: NotificationService,
    private _permissionService: PermissionService,
    private _router: Router,
    private translate: TranslateService,
  ) {
    // this._signalRService.initNotificationHub();
  }
  dsLanguage = [];
  activeItem: number;

  @ViewChild('searchInput') searchInputViewChild: ElementRef;
  notificationIsRead = NotificationIsRead;
  currentUser = new CoreUser;
  userId: string;
  dataSource = [];
  totalUnRead = 0;
  ngOnInit() {
    this._userService.getCurrentUser().then(rs => {
      if (rs.displayName) {
        this.currentUser = rs;
      }
    });

    this._userService.getId().then(rs => {
      this.userId = rs.toString();
      // this._signalRService.start(
      //   environment.signalrConfig.topic.notificationCreated,
      //   'NotificationHub',
      //   this.notifyTrigger.bind(this)
      // );

      // this._signalRService.start(
      //   environment.signalrConfig.topic.notificationCreated,
      //   'CommonHub',
      //   this.refreshPermissions.bind(this)
      // );

      //this.refreshNotification();
    });
  }

  refreshPermissions() {
    this._permissionService.refreshPermissions();
  }

  notifyTrigger(data: any) {
    console.log(data);
    if (data !== null) {
      if (data.userId !== null) {
        if (data.userId.indexOf(',' + this.userId + ',') !== -1) {
          console.log('refreshNotification:  ' + this.userId);
          this.refreshNotification();
        }
      } else {
        console.log('refreshNotification:  All');
        this.refreshNotification();
      }
    }
  }

  refreshNotification() {
    this._notificationService.getsMyNotification(1, 9999, this.notificationIsRead.UnRead)
      .then(result => {
        this.dataSource = result.data;
        this.totalUnRead = result.totalRecord;
        sessionStorage.setItem('numOfNotifiUnRead', this.totalUnRead.toString());
      });
  }

  readAll(event) {
    event.preventDefault();
    event.stopPropagation();

    this._notificationService.readAll().then(rs => {
      this.dataSource.forEach(element => {
        if (element.read != null) {
          element.read.push({ userId: this.userId });
        } else {
          element.read = [{ userId: this.userId }];
        }
      });
    });

    this.totalUnRead = 0;
  }

  readItem(item) {
    item.isRead = 1;
    this._notificationService.readMessage(item.toId).then(rs => {
    });
  }

  onSearchAnimationEnd(event: AnimationEvent) {
    switch (event.toState) {
      case 'visible':
        this.searchInputViewChild.nativeElement.focus();
        break;
    }
  }
  goNotification() {
    this._router.navigate(['/core/notifications']);
  }
}
