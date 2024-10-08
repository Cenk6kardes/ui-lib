import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PanelMessagesModule } from '../panel-messages.module';
import { PanelMessagesComponent } from './panel-messages.component';

describe('PanelMessagesComponent', () => {
  let component: PanelMessagesComponent;
  let fixture: ComponentFixture<PanelMessagesComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelMessagesComponent],
      imports: [ PanelMessagesModule ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defaul is info panel message', () => {
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.pannel-toast-message-info'));
    expect(element).toBeTruthy();
  });

  it('should be a title', () => {
    component.title = 'test';
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.pannel-toast-summary'));
    expect(element.nativeElement.textContent.trim()).toEqual('test');
  });

  it('should be a content', () => {
    component.content = 'this is a content';
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.pannel-toast-detail'));
    expect(element.nativeElement.textContent.trim()).toEqual('this is a content');
  });

  it('should be a type of message', () => {
    component.typeOfMessage = 'success';
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.pannel-toast-message-success'));
    expect(element).toBeTruthy();
  });
});
