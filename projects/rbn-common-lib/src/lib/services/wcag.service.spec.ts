import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { WcagService } from './wcag.service';

describe('WcagService', () => {
  let service: WcagService;
  const translateService = jasmine.createSpyObj<TranslateService>('translateService', ['get']);
  const translateServiceMock = {
    use: translateService.get,
    get: translateService.get.and.returnValue(of({
      'FIELD_LABEL': 'This field'
    }))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    });
    service = TestBed.inject(WcagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setClickForElement with keydown', () => {
    const dummyElement = document.createElement('div');
    spyOn(dummyElement, 'click');
    const event = new KeyboardEvent('keydown', {
      code: 'Enter'
    });
    service.setClickForElement([dummyElement]);
    dummyElement.dispatchEvent(event);
    expect(dummyElement.click).toHaveBeenCalled();
  });

  it('should call setClickForElement with keyup', () => {
    const dummyElement = document.createElement('div');
    spyOn(dummyElement, 'click');
    const event = new KeyboardEvent('keyup', {
      code: 'Enter'
    });
    service.setClickForElement([dummyElement]);
    dummyElement.dispatchEvent(event);
    expect(service.handleEvent).toBeFalsy();
  });

  it('should call getFocusableElm', () => {
    let element = null;
    let child = null;
    element = document.createElement('input');
    expect(service.getFocusableElm(element)).toEqual(element);
    element = document.createElement('p-dropdown');
    child = document.createElement('input');
    element.appendChild(child);
    expect(service.getFocusableElm(element)).toEqual(child);
    element = document.createElement('rbn-file-upload');
    child = document.createElement('button');
    child.classList.add('p-button');
    element.appendChild(child);
    expect(service.getFocusableElm(element)).toEqual(child);
  });

  it('should call getFieldName', () => {
    let field = null;
    expect(service.getFieldName(field)).toEqual('This field');
    field = document.createElement('input');
    expect(service.getFieldName(field)).toEqual('This field');
    field.id = 'fullName';
    field.style.display = 'none';
    const label = document.createElement('label');
    label.setAttribute('for', 'fullName');
    label.innerText = 'Full name';
    label.style.display = 'none';
    document.body.appendChild(label);
    document.body.appendChild(field);
    expect(service.getFieldName(field)).toEqual(label.innerText);
  });
});
