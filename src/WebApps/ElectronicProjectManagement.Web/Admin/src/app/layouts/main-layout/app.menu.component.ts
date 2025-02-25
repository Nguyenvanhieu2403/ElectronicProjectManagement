import { Component, OnInit } from '@angular/core';
import { SysMenusService } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-menu',
  template: `
        <ul class="layout-menu">
            <li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
        </ul>
    `
})
export class AppMenuComponent implements OnInit {

  model: any[];

  constructor(
    public app: AppComponent,
    private _menuService: SysMenusService
  ) { }

  ngOnInit() {
    // this.model = [
    //     {
    //         label: 'Home', icon: 'pi pi-fw pi-home',
    //         items: [
    //             { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
    //             { label: 'Client Template', icon: 'pi pi-fw pi-bars', routerLink: ['/client-template'] },
    //         ]
    //     },
    // ];
    this.getMenu();
  }

  getMenu() {
    const cacheVal = sessionStorage.getItem('sysmenu' + environment.clientDomain.idSystem.toString());
    if (cacheVal !== undefined && cacheVal !== null) {
      this.model = JSON.parse(cacheVal);
    } else {
      this._menuService.getTreeMenu(environment.clientDomain.idSystem, 1).then(rs => {
        if (rs.success) {
          this.model = rs.data;
          sessionStorage.setItem('sysmenu' + environment.clientDomain.idSystem.toString(), JSON.stringify(rs.data));
        }
      });
    }
  }
}
