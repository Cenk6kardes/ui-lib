import { MessageToggleHiddenComponent } from './message-toggle-hidden.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MessageToggleModule } from '../message-toggle.module';

describe('MessageToggleHidden', () => {
  let component: MessageToggleHiddenComponent;
  let fixture: ComponentFixture<MessageToggleHiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageToggleHiddenComponent],
      imports: [
        BrowserAnimationsModule,
        MessageToggleModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageToggleHiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should message-toggle-hidden create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear message', () => {
    component.key = 'test';
    component.clearMessage();
    expect(component.key).toEqual('');
  });
});
