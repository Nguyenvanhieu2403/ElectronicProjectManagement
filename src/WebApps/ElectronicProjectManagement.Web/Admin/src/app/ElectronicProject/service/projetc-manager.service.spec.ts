/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjetcManagerService } from './projetc-manager.service';

describe('Service: ProjetcManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjetcManagerService]
    });
  });

  it('should ...', inject([ProjetcManagerService], (service: ProjetcManagerService) => {
    expect(service).toBeTruthy();
  }));
});
