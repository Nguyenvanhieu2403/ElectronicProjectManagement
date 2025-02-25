import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService, ResponseResult } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AzRoleMappingUsersService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/azrolemappingusers`);
  }

  find(model: any): Promise<ResponseResult> {
    const apiUrl = `${this.serviceUri}/find`;
    return this._http
      .post<ResponseResult>(apiUrl, model)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  findRole(model: any): Promise<ResponseResult> {
    const apiUrl = `${this.serviceUri}/findRole`;
    return this._http
      .post<ResponseResult>(apiUrl, model)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  getsByUserId(userId: number): Promise<ResponseResult> {
    const apiUrl = `${this.serviceUri}/GetsByUserId/${userId}`;
    return this.defaultGet(apiUrl);
  }

  updateByUserId(userId: number, dsIdAzRole: any[]): Promise<ResponseResult> {
    const apiUrl = `${this.serviceUri}/UpdateByUserId/${userId}`;
    return this._http
      .post<ResponseResult>(apiUrl, dsIdAzRole)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
}
