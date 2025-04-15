/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ThesisDefenceService } from './thesis-defence.service';

describe('Service: ThesisDefence', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThesisDefenceService]
    });
  });

  it('should ...', inject([ThesisDefenceService], (service: ThesisDefenceService) => {
    expect(service).toBeTruthy();
  }));
});
