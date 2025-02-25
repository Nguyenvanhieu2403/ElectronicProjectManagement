import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService, ResponseResult } from 'vnpost-shared';

import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AzRolesService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/azroles`);
  }

  find(keyword: string, status?: number, idAzService?: number, pageIndex?: number, pageSize?: number, orderCol?: string, isDesc: boolean = true): Promise<ResponseResult> {
    var model = {
      keyword: keyword,
      status: status,
      idAzService: idAzService,
      pageIndex: pageIndex,
      pageSize: pageSize,
      orderCol: orderCol,
      isDesc: isDesc,
    }
    const apiUrl = `${this.serviceUri}/find`;
    return this._http
      .post<ResponseResult>(`${apiUrl}`, model).pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  getsByOriginalRole(idAzRoleOriginal: number): Promise<ResponseResult> {
    const apiUrl = `${this.serviceUri}/GetsByOriginalRole?idAzRoleOriginal=${idAzRoleOriginal}`;
    return this.defaultGet(apiUrl);
  }

  getsNotUsedByOriginalRole(idAzRoleOriginal: number, idAzService: number) {
    const apiUrl = `${this.serviceUri}/GetsNotUsedByOriginalRole?idAzRoleOriginal=${idAzRoleOriginal}&idAzService=${idAzService}`;
    return this.defaultGet(apiUrl);
  }
}
