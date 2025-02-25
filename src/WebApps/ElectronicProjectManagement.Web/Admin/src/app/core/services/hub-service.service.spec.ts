/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HubServiceService } from './hub-service.service';

describe('Service: HubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HubServiceService]
    });
  });

  it('should ...', inject([HubServiceService], (service: HubServiceService) => {
    expect(service).toBeTruthy();
  }));
});
