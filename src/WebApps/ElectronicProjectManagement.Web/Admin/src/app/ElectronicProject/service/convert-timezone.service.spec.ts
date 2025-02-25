/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConvertTimezoneService } from './convert-timezone.service';

describe('Service: ConvertTimezone', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvertTimezoneService]
    });
  });

  it('should ...', inject([ConvertTimezoneService], (service: ConvertTimezoneService) => {
    expect(service).toBeTruthy();
  }));
});
