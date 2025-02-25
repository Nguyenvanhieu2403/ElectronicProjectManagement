import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService, ResponseResult } from 'vnpost-shared';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AzControllersService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/azcontrollers`);
  }

  getsByIdService(idService: number): Promise<ResponseResult> {
    const apiUrl = `${this.serviceUri}/GetsByIdService/${idService}`;
    return this.defaultGet(apiUrl);
  }

}
