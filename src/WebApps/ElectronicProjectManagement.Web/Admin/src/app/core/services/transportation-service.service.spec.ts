/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TransportationServiceService } from '../../oe/service/transportation-service.service';

describe('Service: TransportationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransportationServiceService]
    });
  });

  it('should ...', inject([TransportationServiceService], (service: TransportationServiceService) => {
    expect(service).toBeTruthy();
  }));
});
