import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReferencesFileManagerService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dotnetEndpoint}/ReferencesFile`);
  }

  getsReferencesFile(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsReferencesFileBySearch`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  exportReportMornitoringKT1(model: any): Observable<Blob> {
    const apiUrl = `${this.serviceUri}/ExportExcelKT1`;
    return this._http.post(apiUrl, model, { responseType: 'blob' });
  }

  addReferencesFile(model: any, file: File): Promise<any> {
    const apiUrl = `${this.serviceUri}/CreateReferencesFile`;
    const formData = new FormData();
    formData.append('file', file);
    
    for (const key in model) {
      if (model.hasOwnProperty(key)) {
        formData.append(key, model[key]);
      }
    }
    return this._http
    .post<any>(apiUrl, formData)
    .pipe(catchError((err) => this.handleError(err, this._injector)))
    .toPromise();
  } 

  updateReferencesFile(model: any, file: File): Promise<any> {
    const apiUrl = `${this.serviceUri}/UpdateReferencesFile`;
    const formData = new FormData();
    formData.append('file', file);
    
    for (const key in model) {
      if (model.hasOwnProperty(key)) {
        formData.append(key, model[key]);
      }
    }
    return this._http
    .post<any>(apiUrl, formData)
    .pipe(catchError((err) => this.handleError(err, this._injector)))
    .toPromise();
  } 

  deleteReferencesFile(id: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/DeleteReferencesFile?id=${id}`;
    return this._http
      .delete<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  exportExcel(model: any): Observable<Blob> {
    const apiUrl = `${this.serviceUri}/ExportExcel`;
    return this._http.post(apiUrl, model, { responseType: 'blob' });
  }

}
