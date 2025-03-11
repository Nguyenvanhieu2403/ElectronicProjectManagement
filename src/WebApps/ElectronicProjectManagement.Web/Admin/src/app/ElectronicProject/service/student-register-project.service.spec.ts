/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StudentRegisterProjectService } from './student-register-project.service';

describe('Service: StudentRegisterProject', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentRegisterProjectService]
    });
  });

  it('should ...', inject([StudentRegisterProjectService], (service: StudentRegisterProjectService) => {
    expect(service).toBeTruthy();
  }));
});
