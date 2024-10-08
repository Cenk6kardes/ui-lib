import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderlogoComponent } from './headerlogo.component';
import { HeaderlogoModule } from '../headerlogo.module';

describe('HeaderlogoComponent', () => {
  let component: HeaderlogoComponent;
  let fixture: ComponentFixture<HeaderlogoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderlogoComponent],
      imports: [HeaderlogoModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderlogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show Test Product Name', () => {
    const productName = 'TEST PRODUCT NAME';
    component.productName = productName;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.productName').innerText).toEqual(productName);
  });

});
