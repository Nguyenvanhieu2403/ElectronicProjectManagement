import { Injectable, Injector } from '@angular/core';
import { BaseService } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { get } from 'http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PersonalProjectManagementService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(
      http,
      injector,
      `${environment.apiDomain.dotnetEndpoint}/PersonalProjectManagement`
    );
  }

  getsPersonalProjectManagement(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsPersonalProjectManagementBySearch`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  getsPersonalProjectManagementApprovalBySearch(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsPersonalProjectManagementApprovalBySearch`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  getPersonalProjectManagementById(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsPersonalProjectManagementByStudentId`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  uploadPersonalProjectManagement(
    model: any,
    pdf: File,
    ppt: File,
    source: File
  ): Promise<any> {
    const apiUrl = `${this.serviceUri}/UploadProject?IdStudent=${model.idStudent}&IdProjectsTeachersStudents=${model.idProjectsTeachersStudents}`;
    const formData = new FormData();
    formData.append('pdf', pdf);
    formData.append('ppt', ppt);
    formData.append('source', source);
    return this._http
      .post<any>(apiUrl, formData)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  checkPlagiarism(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/CheckPlagiarism/?FilePath=${model.filePath}&IdProjectsTeachersStudents=${model.idProjectsTeachersStudents}`;
    return this._http
      .post<any>(apiUrl, null)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  projectApproval(idProjectsTeachersStudents: any, status: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/ProjectApproval?IdProjectsTeachersStudents=${idProjectsTeachersStudents}&Status=${status}`;
    return this._http
      .post<any>(apiUrl, null)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  rejectProject(
    idProjectsTeachersStudents: any,
    status: any,
    reason: any
  ): Promise<any> {
    const apiUrl = `${this.serviceUri}/RejectProject?IdProjectsTeachersStudents=${idProjectsTeachersStudents}&Status=${status}&Reason=${reason}`;
    return this._http
      .post<any>(apiUrl, null)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
}
