/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TopicManagerService } from './topic-manager.service';

describe('Service: TopicManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopicManagerService]
    });
  });

  it('should ...', inject([TopicManagerService], (service: TopicManagerService) => {
    expect(service).toBeTruthy();
  }));
});
