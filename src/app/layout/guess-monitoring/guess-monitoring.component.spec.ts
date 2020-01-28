import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessMonitoringComponent } from './guess-monitoring.component';

describe('GuessMonitoringComponent', () => {
  let component: GuessMonitoringComponent;
  let fixture: ComponentFixture<GuessMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuessMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
