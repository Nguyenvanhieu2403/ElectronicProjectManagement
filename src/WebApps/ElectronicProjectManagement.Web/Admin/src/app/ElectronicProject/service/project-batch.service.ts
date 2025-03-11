import { Injectable, Injector } from '@angular/core';
import { BaseService } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectBatchService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(
      http,
      injector,
      `${environment.apiDomain.dotnetEndpoint}/ProjectBatch`
    );
  }

  getsProjectBatchBySearch(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetBySearchProjectBatch`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  getProjectBatchById(id: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetProjectBatchById?id=${id}`;
    return this._http
      .get<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  addProjectBatch(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/CreateProjectBatch`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  updateProjectBatch(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/UpdateProjectBatch`;
    return this._http
      .put<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  deleteProjectBatch(id: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/DeleteProjectBatch?id=${id}`;
    return this._http
      .delete<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  getsUserByProjectBatchId(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsUserByProjectBatchId`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }
}
