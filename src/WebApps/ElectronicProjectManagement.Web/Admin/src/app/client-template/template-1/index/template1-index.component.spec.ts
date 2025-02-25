/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Template1IndexComponent } from './template1-index.component';

describe('Template1IndexComponent', () => {
  let component: Template1IndexComponent;
  let fixture: ComponentFixture<Template1IndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Template1IndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Template1IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
