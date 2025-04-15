/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThesisDefenceComponent } from './thesis-defence.component';

describe('ThesisDefenceComponent', () => {
  let component: ThesisDefenceComponent;
  let fixture: ComponentFixture<ThesisDefenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThesisDefenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesisDefenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
