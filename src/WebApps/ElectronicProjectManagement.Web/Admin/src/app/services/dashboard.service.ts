import { Injectable, Injector } from '@angular/core';
import { BaseService } from 'vnpost-shared';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(
      http,
      injector,
      `${environment.apiDomain.dotnetEndpoint}/Dashboard`
    );
  }

  getDashboardTotal(): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetDashboardTotal`;
    return this._http
      .get<any>(apiUrl)
      .toPromise();
  }

  getDashboardProjectScoreStatisticsForYear(): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetDashboardProjectScoreStatisticsForYear`;
    return this._http
      .get<any>(apiUrl)
      .toPromise();
  }

  getDashboardProjectStatisticsByTopic(): Promise<any> {
    const apiUrl = `${this.serviceUri}/GetDashboardProjectStatisticsByTopic`;
    return this._http
      .get<any>(apiUrl)
      .toPromise();
  }
}
