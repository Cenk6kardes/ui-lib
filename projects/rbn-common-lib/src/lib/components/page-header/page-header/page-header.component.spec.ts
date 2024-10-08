import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageHeaderComponent } from './page-header.component';
import { OverlayPanel } from 'primeng/overlaypanel';
import { PageHeaderModule } from '../page-header.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../shared/http-loader';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;
  let translateSevice: TranslateService | undefined;
  let http: HttpTestingController | undefined;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageHeaderComponent],
      imports: [
        PageHeaderModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    component.data = {
      title: 'Header Test',
      breadcrumb:
        [{
          label: 'VNF',
          command: (event) => {
            console.log('call back');
          }
        },
        { label: 'Lifecycle' }]
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call backAction', () => {
    component.onBack();
    expect(component.onBack).toBeTruthy();
  });

  it('should call selectedDropItem', () => {
    spyOn(component.selectedDropItem, 'emit');
    fixture.detectChanges();
    const event = { value: 'test' };
    component.onDropdownChange(event);
    expect(component.selectedDropItem.emit).toHaveBeenCalled();
  });

  it('should call selectedMenuItem', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    component.overlayPanel = { hide: () => { } } as OverlayPanel;
    spyOn(component.selectedMenuItem, 'emit');
    component.onClickSelectedMenuItem({ option: 'test' });
    expect(component.selectedMenuItem.emit).toHaveBeenCalledWith('test');
  });

  it('should call getTagData', () => {
    component.tag = { label: 'Test', type: 'new' };
    const tag = component.getTagData();
    expect(tag.label).toEqual('test');
  });

  it('existedExpiryTag - should return true', () => {
    component.data.title = 'title';
    const existedExpiryTag = component.existedExpiryTag('title, test2');
    expect(existedExpiryTag).toBeTruthy();
  });

  it('existedExpiryTag - should return false', () => {
    component.data.title = 'title';
    const existedExpiryTag = component.existedExpiryTag('test1, test2');
    expect(existedExpiryTag).toBeFalsy();
  });

  it('checkExpiryTag - should set isShowTag = true if not expiry', () => {
    spyOn(component, 'existedExpiryTag').and.returnValue(false);
    component.checkExpiryTag();
    expect(component.isShowTag).toBeTruthy();
  });

  it('checkExpiryTag - should set isShowTag = false if expiried', () => {
    spyOn(component, 'existedExpiryTag').and.returnValue(true);
    component.checkExpiryTag();
    expect(component.isShowTag).toBeFalsy();
  });

  it('should remove the separated chevrons role', () => {
    component.removeSeparatedChevronsRole();
    const separatedChevrons = (component as any).el.nativeElement?.querySelectorAll('.p-breadcrumb-chevron.pi-chevron-right');
    separatedChevrons.forEach(chevron => {
      if(chevron.role){
        expect(chevron.role).toEqual('none');
      }
    });
  });

});
