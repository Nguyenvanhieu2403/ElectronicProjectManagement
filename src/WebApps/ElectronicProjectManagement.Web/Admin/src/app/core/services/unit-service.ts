import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService, ResponseResult } from 'vnpost-shared';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UnitService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/Unit`);
  }
  getTreeByUnitCode(unitCode: string) {
    const apiUrl = `${this.serviceUri}/GetTreeByUnitCode?unitCode=${unitCode}`;
    return this._http
      .get<ResponseResult>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
  getTreeUnitByUnitCode(unitCode: string) {
    const apiUrl = `${this.serviceUri}/GetTreeUnitByUnitCode?unitCode=${unitCode}`;
    return this._http
      .get<ResponseResult>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
}
