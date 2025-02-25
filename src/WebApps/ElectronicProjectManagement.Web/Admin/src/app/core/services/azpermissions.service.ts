import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService, ResponseResult } from 'vnpost-shared';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AzPermissionsService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/azpermissions`);
  }

  find(model: any): Promise<ResponseResult> {

    const apiUrl = `${this.serviceUri}/find`;
    return this._http
      .post<ResponseResult>(`${apiUrl}`, model).pipe(catchError(err => this.handleError(err, this._injector))).toPromise();

  }

  syncPermissionsByIdService(idService: number, apiDiscovery: string): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/SyncPermissionsByIdService/${idService}?apiDiscovery=${apiDiscovery}`, apiDiscovery).pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  getsAllByIdAzService(idAzService: number): Promise<ResponseResult> {
    const apiUrl = `${this.serviceUri}/GetsAllByIdAzService/${idAzService}`;
    return this.defaultGet(apiUrl);
  }

  getsByIdAzRole(idAzRole: number): Promise<ResponseResult> {
    const apiUrl = `${this.serviceUri}/GetsByIdAzRole/${idAzRole}`;
    return this.defaultGet(apiUrl);
  }
}
