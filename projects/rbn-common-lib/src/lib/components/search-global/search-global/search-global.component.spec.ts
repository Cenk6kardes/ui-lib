import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayPanel } from 'primeng/overlaypanel';
import { SearchGlobalModule } from '../search-global.module';

import { SearchGlobalComponent } from './search-global.component';

describe('SearchGlobalComponent', () => {
  let component: SearchGlobalComponent;
  let fixture: ComponentFixture<SearchGlobalComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SearchGlobalModule
      ],
      declarations: [SearchGlobalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGlobalComponent);
    component = fixture.componentInstance;

    component.searchOverLayEl = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      hide: () => { },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      show: (event) => { }
    } as OverlayPanel;
    component.hasSearchOverLay = true;
    component.searchConfig = {
      searchData: 'item'
    };
    component.searchList = [
      {
        title: 'item1'
      },
      {
        title: 'item2'
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call activeInput', () => {
    component.isActive = false;
    component.activeInput();
    expect(component.isActive).toBeTrue();
  });

  it('should call enterValue', () => {
    spyOn(component.inputValueEvent, 'emit');
    component.searchConfig = {
      searchData: 'test'
    };
    component.enterValue();
    expect(component.inputValueEvent.emit).toHaveBeenCalled();
  });

  it('should hide overlay on enter value', () => {
    spyOn(component.searchOverLayEl, 'hide');
    component.enterValue();
    expect(component.searchOverLayEl.hide).toHaveBeenCalled();
  });

  it('should call clearSearchGlobal', () => {
    spyOn(component.clearBtnEvent, 'emit');
    component.clearSearchGlobal();
    expect(component.clearBtnEvent.emit).toHaveBeenCalled();
  });

  it('should call pressEnterEv', () => {
    spyOn(component.pressEnterEvent, 'emit');
    const event = {
      key: 'Enter',
      keyCode: 13
    };
    component.pressEnterEv(event);
    expect(component.pressEnterEvent.emit).toHaveBeenCalled();
  });

  it('should emit selected search item and hide the overlay', () => {
    spyOn(component.selectSearchItemEvent, 'emit');
    spyOn(component.searchOverLayEl, 'hide');
    component.onSelectSearchItem({ title: 'title' });
    expect(component.selectSearchItemEvent.emit).toHaveBeenCalled();
    expect(component.searchOverLayEl.hide).toHaveBeenCalled();
  });

  it('should return highlight span', () => {
    expect(component.getContent('item')).toEqual('<span class="highlight">item</span>');
  });
});
