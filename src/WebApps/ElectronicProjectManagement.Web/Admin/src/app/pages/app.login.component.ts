import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageEditBase, CorePublicService } from 'vnpost-shared';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
})
export class AppLoginComponent extends SecondPageEditBase implements OnInit {
  model: LoginModel = new LoginModel();
  error = false;
  returnUrl: string;
  enableLogin = true;
  isSSOAccount = false;

  constructor(
    protected _injector: Injector,
    private _router: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private _oauthService: OAuthService,
    private _corePublicService: CorePublicService,
    private translate: TranslateService,

  ) {
    super(null, _injector);

    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      isSSOAccount: ['']
    });
  }

  ngOnInit() {
    this.returnUrl = this._router.queryParams['returnUrl'] || '/';
    this._oauthService.requireHttps = false;
    if (this._authenticationService.isLoggedIn() && this._oauthService.hasValidAccessToken()) {
      // top.location.href = this.returnUrl;
    } else {
      localStorage.clear();
      sessionStorage.clear();
    }
  }


  clickLogin() {
    this.submitting = true;
    if (!this.formGroup.invalid) {
      this._oauthService.loadDiscoveryDocumentAndTryLogin().then(rs => {
        if (!rs) {
          var myHeaders = new HttpHeaders().set('isSSOAccount', this.isSSOAccount.toString());

          this._oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(this.model.username, this.model.password, myHeaders).then(result => {
            this._oauthService.setupAutomaticSilentRefresh();
            this._notifierService.showSuccess(this._translateService.instant('LOGIN.MESSAGE_OK'));
            setTimeout(() => {
              this.submitting = false;
              top.location.href = this.returnUrl;
            }, 500);
          },
            error => {
              console.log(error.error.error_description);
              this._notifierService.showWarning(this._translateService.instant(error.error.error_description));
              setTimeout(() => {
                this.submitting = false;
              }, 500);
            }
          );
        }
      });
    } else {
      console.log('invalid');
    }

  }

  onFocus() {
    this.submitting = false;
    this.error = false;
  }
  goForgotPass() {
    this.enableLogin = !this.enableLogin;
  }

  onResetPassword() {
    if (this.model.username !== undefined && this.model.email !== undefined) {
      this._corePublicService.resetPassword(this.model).then(rs => {
        if (rs.success) {
          this._notifierService.showSuccess(this._translateService.instant("LOGIN.MESSAGE_SENDPASSOK"));
          this.enableLogin = true;
        } else {
          this._notifierService.showWarning(rs.message);
        }
      }, error => {
        this._notifierService.showWarning(this._translateService.instant(error.error.error_description));
      });
    } else {
      this._notifierService.showWarning(this._translateService.instant("LOGIN.FORGOTPASSWORD.DETAIL"))
    }

  }
}

class LoginModel {
  username: string;
  password: string;
  remember: boolean;
  email: string;
}
