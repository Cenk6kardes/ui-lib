import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReadOnlyFormComponent } from './read-only-form.component';

describe('ReadOnlyFormComponent', () => {
  let component: ReadOnlyFormComponent;
  let fixture: ComponentFixture<ReadOnlyFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadOnlyFormComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadOnlyFormComponent);
    component = fixture.componentInstance;
    component.json = {
      'Model & Mode irmware ver nirmware version': 'SBC 1000 | Perpetual - 0 Cal',
      'Firmware version': 'Bangalore',
      'Ahihi': 'Chennai',
      'Policy Compliant': 'Andhra'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
