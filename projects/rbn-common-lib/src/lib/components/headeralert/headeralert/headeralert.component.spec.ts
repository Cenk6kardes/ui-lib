import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Observable } from 'rxjs';

import { HeaderalertComponent } from './headeralert.component';
import { Headeralert } from '../../../models/headeralert';
import { HeaderalertModule } from '../headeralert.module';

describe('HeaderalertComponent', () => {
  let component: HeaderalertComponent;
  let fixture: ComponentFixture<HeaderalertComponent>;
  let debugElement: DebugElement;
  // const alertService = jasmine.createSpyObj('alertService', ['getAlertCounts']);
  let alertService = null;
  class AlertServiceStub {
    getAlertCounts(): Observable<Headeralert> {
      return of(new Headeralert(1, 2, 3));
    }
  }

  beforeEach(waitForAsync(() => {
    alertService = new AlertServiceStub();
    TestBed.configureTestingModule({
      declarations: [HeaderalertComponent],
      imports: [
        HttpClientModule,
        HeaderalertModule
      ],
      providers: [
        { provide: 'HeaderalertInterfaceService', useValue: alertService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    fixture = TestBed.createComponent(HeaderalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show info icon', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const infoIcon = debugElement.queryAll(By.css('.info'))[0].nativeElement;
    expect(infoIcon.attributes.class.textContent).toEqual('fa fa-circle fa-1 info');
  });

  it('should show info', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const info = debugElement.queryAll(By.css('.info'))[1].nativeElement;
    expect(info.attributes.class.textContent).toEqual('cnt info');
    expect(info.textContent).toEqual('1');
  });

  it('should show debug', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const debug = debugElement.queryAll(By.css('.debug'))[1].nativeElement;
    expect(debug.attributes.class.textContent).toEqual('cnt debug');
    expect(debug.textContent).toEqual('2');
  });

  it('should show error', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const error = debugElement.queryAll(By.css('.error'))[1].nativeElement;
    expect(error.attributes.class.textContent).toEqual('cnt error');
    expect(error.textContent).toEqual('3');
  });

});
