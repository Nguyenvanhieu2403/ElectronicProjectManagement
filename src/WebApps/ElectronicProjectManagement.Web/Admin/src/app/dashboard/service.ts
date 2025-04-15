import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService, ResponseResult } from 'vnpost-shared';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/MapMpitsBccp`);
  }

  getDataFindByModel(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetItemData`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
  getListPos(posCode: string) {
    const apiUrl = `${this.serviceUri}/GetPosCode?posCode=${posCode}`;
    return this._http
      .get<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
  getListCustomer(posCode: string) {
    const apiUrl = `${this.serviceUri}/GetCustomer=${posCode}`;
    return this._http
      .get<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
}
