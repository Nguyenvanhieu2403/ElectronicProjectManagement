import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TopicManagerService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dotnetEndpoint}/Topic`);
  }

  getsTopicBySearch(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsTopicBySearch`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  exportReportMornitoringKT1(model: any): Observable<Blob> {
    const apiUrl = `${this.serviceUri}/ExportExcelKT1`;
    return this._http.post(apiUrl, model, { responseType: 'blob' });
  }

  addTopic(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/CreateTopic`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  updateTopic(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/UpdateTopic`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  deleteReferencesFile(id: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/${id}`;
    return this._http
      .delete<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
}
