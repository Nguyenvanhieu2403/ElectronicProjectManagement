/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CommentThesisDefenceComponent } from './comment-thesis-defence.component';

describe('CommentThesisDefenceComponent', () => {
  let component: CommentThesisDefenceComponent;
  let fixture: ComponentFixture<CommentThesisDefenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentThesisDefenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentThesisDefenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
