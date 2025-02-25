import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService, ResponseResult } from 'vnpost-shared';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoreUserService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/users`);
  }

  updateMyInfo(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/updateMyInfo`;
    return this._http
      .put<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  resetPassword(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/ResetPassword`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  getByUnitCode(unitCode: any) {
    const apiUrl = `${this.serviceUri}/getByUnitCode?unitCode=${unitCode}`;
    return this._http
      .get<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  generateLlbCode(unitCode: any) {
    const apiUrl = `${this.serviceUri}/generateLlbCode?unitCode=${unitCode}`;
    return this._http
      .get<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  checkLlbCodeBeforeCreate(llbCode: any, unitCode: any) {
    const apiUrl = `${this.serviceUri}/checkLlbCodeBeforeCreate?llbCode=${llbCode}&unitCode=${unitCode}`;
    return this._http
      .get<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
  getTemplateImportUsers(): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetTemplateImportUsers`;
    return this._http
      .post<any>(apiUrl, {})
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
  importUsersRoot(model): Promise<any> {
    const apiUrl = `${this.serviceUri}/ImportUsers`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
}
