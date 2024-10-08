import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationGlobalModule } from '../notification-global.module';
import { NotificationGlobalComponent } from './notification-global.component';

describe('NotificationGlobalComponent', () => {
  let component: NotificationGlobalComponent;
  let fixture: ComponentFixture<NotificationGlobalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGlobalComponent ],
      imports: [ NotificationGlobalModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
