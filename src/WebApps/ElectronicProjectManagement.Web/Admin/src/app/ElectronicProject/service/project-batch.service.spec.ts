/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjectBatchService } from './project-batch.service';

describe('Service: ProjectBatch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectBatchService]
    });
  });

  it('should ...', inject([ProjectBatchService], (service: ProjectBatchService) => {
    expect(service).toBeTruthy();
  }));
});
