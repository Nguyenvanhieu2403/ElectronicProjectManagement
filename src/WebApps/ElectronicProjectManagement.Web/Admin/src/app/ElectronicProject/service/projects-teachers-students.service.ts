import { Injectable, Injector } from '@angular/core';
import { BaseService } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsTeachersStudentsService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(
      http,
      injector,
      `${environment.apiDomain.dotnetEndpoint}/ProjectsTeachersStudents`
    );
  }

  getsProjectsTeachersStudentsBySearch(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsProjectsTeachersStudentsBySearch`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  registerTeachers(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/RegisterTeachers`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  getStudentRegister(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetStudentRegister`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  registerStudent(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/RegisterProjects`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  getStudentRegisterProject(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsProjectForStudentRegister`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  projectsTeachersStudentsExportExcel(model: any) : Observable<Blob> {
    const apiUrl = `${this.serviceUri}/ProjectsTeachersStudentsExportExcel`;
    return this._http.post(apiUrl, model, { responseType: 'blob' });
  }
}
