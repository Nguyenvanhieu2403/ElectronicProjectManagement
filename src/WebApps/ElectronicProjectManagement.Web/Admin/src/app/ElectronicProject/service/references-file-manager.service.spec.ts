/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReferencesFileManagerService } from './references-file-manager.service';

describe('Service: ReferencesFileManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferencesFileManagerService]
    });
  });

  it('should ...', inject([ReferencesFileManagerService], (service: ReferencesFileManagerService) => {
    expect(service).toBeTruthy();
  }));
});
