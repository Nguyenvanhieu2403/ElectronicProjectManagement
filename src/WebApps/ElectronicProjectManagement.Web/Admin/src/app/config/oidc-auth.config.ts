import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export const authConfig: AuthConfig = {
  issuer: `${environment.authenticationSettings.issuer}`,
  clientId: `${environment.authenticationSettings.clientId}`,
  redirectUri: window.location.origin,
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  requireHttps: false,
  scope: 'openid profile email',
  showDebugInformation: true,
  sessionChecksEnabled: false,
  requestAccessToken: true,
  // responseType: 'token',
  oidc: false
};
