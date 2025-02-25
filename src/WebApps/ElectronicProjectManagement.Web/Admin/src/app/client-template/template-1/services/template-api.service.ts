import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService, ResponseResult } from 'vnpost-shared';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplateApiService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.coreEndpoint}/templateapi`);
  }

  getsBySearch(model: any): Promise<ResponseResult> {
    const apiUrl = `${this.serviceUri}/GetsBySearch`;
    return this._http
      .post<ResponseResult>(apiUrl, model)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  getById(id: any): Promise<ResponseResult> {

    var result: ResponseResult = {
      success: true,
      data: {
        code: '1234',
        title: 'Viện kỹ thuật - Công nghệ',
        modified: Date.now(),
        modifiedByName: 'Nguyễn Văn A', status: 1
      },
      message: '',
      totalRecord: 1,
      error: ''
    }
    return Promise.resolve(result);
  }
}
