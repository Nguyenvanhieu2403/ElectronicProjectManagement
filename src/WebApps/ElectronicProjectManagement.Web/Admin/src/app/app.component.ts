import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService, UserService } from 'vnpost-shared';
import { PrimeNGConfig } from 'primeng/api';
import { authConfig } from './config/oidc-auth.config';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  topbarTheme: string = 'blue';

  menuTheme: string = 'light';

  layoutMode: string = 'light';

  menuMode: string = 'static';

  inlineMenuPosition: string = 'bottom';

  inputStyle: string = 'filled';

  ripple: boolean = true;

  isRTL: boolean = false;
  dsLanguage = [];
  constructor(
    private primengConfig: PrimeNGConfig,
    private translate: TranslateService,
    private _oauthService: OAuthService,
    private _userService: UserService,
  ) {
    // Config for authentication
    this.configureWithNewConfigApi();
    translate.setDefaultLang('vi');
    translate.use('vi')
  }

  async ngOnInit() {
    this.primengConfig.ripple = true;
  }

  private configureWithNewConfigApi() {
    this._oauthService.setStorage(localStorage);
    this._oauthService.configure(authConfig);
    this._oauthService.tokenValidationHandler = new JwksValidationHandler();

    if (!this._oauthService.hasValidAccessToken()) {

      this._oauthService.loadDiscoveryDocumentAndTryLogin().then(rs => {
        if (!rs) {
          // this._oauthService.initImplicitFlow(`${environment.clientDomain.appDomain}`);
        } else {
          this._userService.returnPromises();
        }
      });
    } else {
      this._userService.returnPromises();
      this._oauthService.loadDiscoveryDocument();

    }
  }
}
