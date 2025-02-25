import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService, ResponseResult } from 'vnpost-shared';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AzRolesHasRoleService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/azroleshasrole`);
  }

  insertMultiple(arrItems: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/InsertMultiple`, arrItems)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

}
