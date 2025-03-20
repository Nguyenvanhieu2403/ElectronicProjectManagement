/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PersonalProjectManagementService } from './personal-project-management.service';

describe('Service: PersonalProjectManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonalProjectManagementService]
    });
  });

  it('should ...', inject([PersonalProjectManagementService], (service: PersonalProjectManagementService) => {
    expect(service).toBeTruthy();
  }));
});
