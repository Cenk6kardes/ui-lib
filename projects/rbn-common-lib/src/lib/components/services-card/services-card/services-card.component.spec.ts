import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardModule } from 'primeng/card';

import { ServicesCardComponent } from './services-card.component';

describe('ServicesCardComponent', () => {
  let component: ServicesCardComponent;
  let fixture: ComponentFixture<ServicesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesCardComponent ],
      imports: [
        CardModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call clickBtnForward', () => {
    spyOn(component.evOnClickBtnForward, 'emit');
    component.clickBtnForward();
    expect(component.evOnClickBtnForward.emit).toHaveBeenCalled();
  });
});
