import { Injectable, Injector } from '@angular/core';
import { BaseService, ResponseResult } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HubServiceService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/Hub`);
  }

  getTreeHubByUnitCode(unitCode: string) {
    const apiUrl = `${this.serviceUri}/GetTreeHubByUnitCode?unitCode=${unitCode}`;
    return this._http
      .get<ResponseResult>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

}
