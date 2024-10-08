import { TestBed } from '@angular/core/testing';
import { SideBar } from '../../../../models/sidebar';

import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;
  const data: SideBar[] = [
    {
      path: 'home',
      data: {
        menu: {
          title: 'Home',
          sidebarLabel: 'Home',
          icon: 'rb-home',
          topLevel: true
        }
      },
      disabled: true,
      children: [{
        path: 'dashboard',
        data: {
          menu: {
            title: 'Dashboards',
            sidebarLabel: 'Dashboards'
          }
        },
        children: [],
        route: {
          paths: 'home',
          fullPath: 'home/dashboard'
        }
      },
      {
        path: 'customDashboard',
        data: {
          menu: {
            title: 'Custom Dashboards',
            sidebarLabel: 'Custom Dashboards'
          }
        },
        children: [],
        route: {
          paths: 'home',
          fullPath: 'home/customDashboard'
        }
      }
      ],
      route: {
        paths: 'home',
        fullPath: 'home'
      }
    },
    {
      path: 'setting',
      data: {
        menu: {
          title: 'setting',
          sidebarLabel: 'setting',
          icon: 'rb-setting',
          topLevel: true
        }
      },
      children: [],
      route: {
        paths: 'setting',
        fullPath: 'setting'
      }
    }
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert data to SideBar data', () => {
    service.convertToSideBarData(data).subscribe(res => {
      expect(res.length).toEqual(2);
    });
  });

  it('should set disable of menuItem Children is true', () => {
    service.addFullPath(data[0], 'test');
    expect(data[0].children[0].disabled).toBeTrue();
  });

  it('should call getPreferences and setPreferences when calling updatePreferences', () => {
    service['_useLocalStorage'] = true;
    const getPreferences = spyOn(service as any, 'getPreferences');
    getPreferences.and.callFake(() => [
      {
        fullPath: 'test',
        preferences: {
          isHidden: true,
          isFavorite: true,
          position: 1
        }
      }
    ]);
    service.tempPrefs = [
      {
        fullPath: 'test',
        preferences: {
          isHidden: true,
          isFavorite: true,
          position: 1
        }
      }
    ];
    const setPreferences = spyOn(service as any, 'setPreferences');
    setPreferences.and.callFake(() => [
      {
        fullPath: 'setTest'
      }
    ]);
    service['updatePreferences']();
    expect(getPreferences).toHaveBeenCalled();
    expect(setPreferences).toHaveBeenCalled();
  });

  it('should call getPreferences and setPreferences when calling updatePreferences', () => {
    service['_useLocalStorage'] = false;
    const prefs = [
      {
        fullPath: 'test',
        preferences: {}
      }
    ];
    service.tempPrefs = [
      {
        fullPath: '',
        preferences: {}
      }
    ];
    const setPreferences = spyOn(service as any, 'setPreferences');
    setPreferences.and.callFake(() => [
      {
        fullPath: 'setTest'
      }
    ]);
    service['updatePreferences'](prefs);
    expect(setPreferences).toHaveBeenCalled();
    expect(service['updatePreferences'](prefs)).toBeTruthy();
  });

  it('should call getPreferences and updatePreferences when calling save', () => {
    service['_useLocalStorage'] = true;
    const getPreferences = spyOn(service as any, 'getPreferences');
    getPreferences.and.callFake(() => [
      {
        fullPath: 'setTest'
      }
    ]);
    const updatePreferences = spyOn(service as any, 'updatePreferences');
    updatePreferences.and.callFake(() => [
      {
        fullPath: 'setTest'
      }
    ]);
    service.save();
    expect(getPreferences).toHaveBeenCalled();
    expect(updatePreferences).toHaveBeenCalled();
  });

  it('should return null when calling save', () => {
    service['_useLocalStorage'] = false;
    const prefs = null;
    expect(service.save(prefs)).toBeFalsy();
  });

  it('should set isHidden when calling updateTempPreference', () => {
    const preference = {
      fullPath: 'test',
      preferences: {
        isHidden: true,
        isFavorite: true
      }
    };
    service.tempPrefs = [
      {
        fullPath: 'test',
        preferences: {
        }
      }
    ];
    service['updateTempPreference'](preference);
    expect(service.tempPrefs[0].preferences.isHidden).toBeTrue();
    expect(service.tempPrefs[0].preferences.isFavorite).toBeTrue();
  });
});
