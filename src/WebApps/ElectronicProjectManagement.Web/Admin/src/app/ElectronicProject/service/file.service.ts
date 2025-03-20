import { Injectable, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dotnetEndpoint}/file`);
  }

  getFiles(path: string): Observable<Blob> {
    const apiUrl = `${environment.apiDomain.fileEndpoint}?filePath=${path}`;
    return this._http.get(apiUrl, { responseType: 'blob' });
  }

  uploadFiles(file: File): Promise<any> {
    const apiUrl = `${this.serviceUri}/uploads`;
    const formData = new FormData();
    formData.append('file', file);
    return this._http
      .post<any>(apiUrl, formData)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  deleteFiles(path: string): Promise<any> {
    const apiUrl = `${this.serviceUri}/uploads?path=${path ?? ''}`;
    return this._http
      .delete<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  getFilePath(path: string): string {
    return `${environment.apiDomain.fileEndpoint}?filePath=${path}`;
  }

  getPdf(path: string) {
    return `${environment.apiDomain.fileEndpoint}/get-pdf?filePath=${path}`;
  }
}
