import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAddPageComponent } from './task-add-page.component';

describe('TaskAddPageComponent', () => {
  let component: TaskAddPageComponent;
  let fixture: ComponentFixture<TaskAddPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskAddPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
