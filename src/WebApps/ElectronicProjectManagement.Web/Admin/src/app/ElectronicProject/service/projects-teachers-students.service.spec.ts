/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjectsTeachersStudentsService } from './projects-teachers-students.service';

describe('Service: ProjectsTeachersStudents', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectsTeachersStudentsService]
    });
  });

  it('should ...', inject([ProjectsTeachersStudentsService], (service: ProjectsTeachersStudentsService) => {
    expect(service).toBeTruthy();
  }));
});
