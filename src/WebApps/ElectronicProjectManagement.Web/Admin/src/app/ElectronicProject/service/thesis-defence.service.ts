import { Injectable, Injector } from '@angular/core';
import { BaseService } from 'vnpost-shared';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThesisDefenceService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(
      http,
      injector,
      `${environment.apiDomain.dotnetEndpoint}/ThesisDefence`
    );
  }

  getsThesisDefenceBySearch(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsThesisDefenceBySearch`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  createThesisDefence(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/CreateThesisDefence`;
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

  getsAllPersonalProjectManagement(): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetsAllPersonalProjectManagement`;
    return this._http
      .get<any>(apiUrl)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  scoringThesisDefence(model: any): Promise<any> {
    const apiUrl = `${this.serviceUri}/ScoringThesisDefence`;
    return this._http
      .post<any>(apiUrl, model)
      .pipe(catchError((err) => this.handleError(err, this._injector)))
      .toPromise();
  }

  exportExcel(model: any) : Observable<Blob> {
    const apiUrl = `${this.serviceUri}/GetsThesisDefenceExportExcel`;
    return this._http.post(apiUrl, model, { responseType: 'blob' });
  }
}
