import { Injectable, Injector } from '@angular/core';
import { BaseService } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjetcManagerService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dotnetEndpoint}/Projects`);
  }

  getsProjectsBySearch(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsProjectsBySearch`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  exportReportMornitoringKT1(model: any): Observable<Blob> {
    const apiUrl = `${this.serviceUri}/ExportExcelKT1`;
    return this._http.post(apiUrl, model, { responseType: 'blob' });
  }

  addProjects(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/CreateProjects`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  proposeProjects(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/ProposeProjects`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  updateProjects(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/UpdateProjects`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  deleteProject(id: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/${id}`;
    return this._http
      .delete<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  importProjects(file: File): Promise<any> {
    const apiUrl = `${this.serviceUri}/ImportProjects`;
    const formData = new FormData();
    formData.append('file', file);
    return this._http
      .post<any>(apiUrl, formData)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  getsStudentsProposedTopics(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsStudentsProposedTopics`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  approveTopic(IdProject: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/ApproveTopic?ProjectId=${IdProject}`;
    return this._http
      .post<any>(apiUrl, null)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  rejectTopic(IdProject: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/RejectTopic?ProjectId=${IdProject}`;
    return this._http
      .post<any>(apiUrl, null)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
}
