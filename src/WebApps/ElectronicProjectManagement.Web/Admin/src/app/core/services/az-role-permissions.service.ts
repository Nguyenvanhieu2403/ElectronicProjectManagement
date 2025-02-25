import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService, ResponseResult } from 'vnpost-shared';

import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AzRolePermissionsService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/azrolepermissions`);
  }

  updatePermissionsByIdAzRole(dsAzPermissionses: any[], idAzRole: string): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/UpdatePermissionsByIdAzRole/${idAzRole}`, dsAzPermissionses).pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
}
