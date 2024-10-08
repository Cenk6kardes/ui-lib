import { SideBar } from '../../../../models/sidebar';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  onNoChildrenClick = new BehaviorSubject(null);
  updateFavorites = new BehaviorSubject(null);
  tag = new BehaviorSubject(null);
  tempPrefs: any[] = [];
  private _useLocalStorage: boolean;

  constructor() { }

  convertToSideBarData(sidebarData: SideBar[]) {
    this.makeSideBarLevel(sidebarData);
    return of(sidebarData);
  }

  makeSideBarLevel(sidebarData: SideBar[]) {
    sidebarData.forEach(element => {
      this.removeEmptyChild(element);
      this.addFullPath(element, null);
    });
  }

  addFullPath(menuItem: SideBar, parentFullPath) {
    menuItem.fullPath = parentFullPath ? `${parentFullPath}/${menuItem.path}` : menuItem.path;
    if (menuItem.fullPath) {
      // Make sure fullPath starts with /
      menuItem.fullPath = '/' + menuItem.fullPath;
      menuItem.fullPath = menuItem.fullPath.replace('//', '/');
    }
    menuItem.title = menuItem.data.menu.title;
    menuItem.display = menuItem.data.menu.title;
    menuItem.sidebarLabel = menuItem.data.menu.sidebarLabel;
    if (menuItem.data.menu.icon) {
      menuItem.icon = menuItem.data.menu.icon;
    }
    if (menuItem.data.menu.topLevel) {
      menuItem.topLevel = menuItem.data.menu.topLevel;
    }
    menuItem.route = {
      paths: menuItem.path,
      fullPath: menuItem.fullPath
    };

    const isDisable = menuItem.disabled;
    if (menuItem.children) {
      for (const subMenuItem of menuItem.children) {
        if (isDisable) {
          subMenuItem.disabled = true;
        }
        this.addFullPath(subMenuItem, menuItem.fullPath);
      }
    } else {
      menuItem.favIcon = 'fa fa-star-o';
    }
  }

  removeEmptyChild(menuItem: SideBar) {
    if (menuItem.children && menuItem.children.length !== 0) {
      for (const subMenuItem of menuItem.children) {
        this.removeEmptyChild(subMenuItem);
      }
    } else {
      delete menuItem.children;
    }
  }

  set useLocalStorage(bool: boolean) {
    this._useLocalStorage = bool;
  }

  /**
   * Creates a sidebarPreferences key in local storage
   * @author rhua
   */
  private createSidebarPreferences() {
    localStorage.setItem('sidebarPreferences', '[]');
  }

  /**
   * Removes the sidebarPreferences key from local storage
   * @author rhua
   */
  removeSidebarPreferences() {
    localStorage.removeItem('sidebarPreferences');
  }

  /**
   * Retrieves sidebarPreferences from local storage. If it does not exist, will create it
   * @returns Returns the sidebar preferences
   */
  getPreferences() {
    const sidebarPreferences = JSON.parse(localStorage.getItem('sidebarPreferences'));
    if (sidebarPreferences === null) {
      this.createSidebarPreferences();
      return [];
    } else {
      return sidebarPreferences;
    }
  }

  /**
   * Adds the preferences to local storage, or returns it if the parent app is responsible
   * for dealing with saving the preferences
   * @param preferences - The preferences to be added
   * @returns If local storage is not being used, will simply return the preferences
   * @author rhua
   */
  setPreferences(preferences) {
    if (this._useLocalStorage) {
      localStorage.setItem('sidebarPreferences', JSON.stringify(preferences));
    } else {
      return preferences;
    }
  }

  /**
   * Removes any preferences that have been saved
   * @author rhua
   */
  clearPreferences() {
    const sidebarPreferences = [];
    this.setPreferences(sidebarPreferences);
  }

  /**
   * Saves the preferences and updates the existing ones
   * @param prefs - The preferences to be saved
   * @returns If local storage is not being used, will return the preferences once it has been updated
   * @author rhua
   */
  save(prefs?) {
    let preferences;
    if (this._useLocalStorage) {
      preferences = this.getPreferences();
    } else {
      if (prefs === null) {
        return;
      }
      preferences = prefs;
    }

    if (preferences === null || preferences.length === 0) {
      preferences = this.setPreferences(this.tempPrefs);
    } else {
      preferences = this.updatePreferences(preferences);
    }
    this.clearTempPreferences();

    if (!this._useLocalStorage) {
      return preferences;
    }
  }

  /**
   * Adds changes to a temporary preference. Temp prefs are deleted if not saved.
   * @param preference - The preference to be added
   * @author rhua
   */
  addTempPreference(preference) {
    if (this.tempPrefs.length === 0) {
      this.addPreference(preference);
    } else {
      this.updateTempPreference(preference);
    }
  }

  /**
   * Clears the temporary preferences
   * @author rhua
   */
  clearTempPreferences() {
    this.tempPrefs = [];
  }

  /**
   * Adds the preference to the tempPrefs array
   * @param preference - The preference to be added
   * @author rhua
   */
  private addPreference(preference) {
    this.tempPrefs.push(preference);
  }

  /**
   * If the preference already exists in the tempPrefs array, it will be updated with the new values
   * @param preference - The preference to be updated
   * @author rhua
   */
  private updateTempPreference(preference) {
    const matchingIndex = this.tempPrefs.findIndex((pref) => pref.fullPath === preference.fullPath);

    // Updates the matching preference
    if (matchingIndex !== -1) {
      if (preference.preferences.isHidden !== undefined) {
        this.tempPrefs[matchingIndex].preferences.isHidden = preference.preferences.isHidden;
      }
      if (preference.preferences.isFavorite !== undefined) {
        this.tempPrefs[matchingIndex].preferences.isFavorite = preference.preferences.isFavorite;
      }
      if (preference.preferences.position !== undefined) {
        this.tempPrefs[matchingIndex].preferences.position = preference.preferences.position;
      }
    } else {
      this.addPreference(preference);
    }
  }

  /**
   * Updates existing preferences. If local storage is not being used, will return the preferences after updating
   * @param prefs - The preference to be updated
   * @returns If local storage is not used, will return the preferences after updating
   */
  private updatePreferences(prefs?) {
    let preferences;
    if (this._useLocalStorage) {
      preferences = this.getPreferences();
    } else {
      preferences = prefs;
    }

    for (let i = 0; i < this.tempPrefs.length; i++) {
      const currentPref = this.tempPrefs[i];

      const index = preferences.findIndex((pref) => currentPref.fullPath === pref.fullPath);

      if (index !== -1) {
        if (currentPref.preferences.isHidden !== undefined) {
          preferences[index].preferences.isHidden = currentPref.preferences.isHidden;
        }

        if (currentPref.preferences.isFavorite !== undefined) {
          preferences[index].preferences.isFavorite = currentPref.preferences.isFavorite;
        }

        if (currentPref.preferences.position !== undefined) {
          preferences[index].preferences.position = currentPref.preferences.position;
        }
      } else {
        preferences.push(currentPref);
      }
    }

    preferences = this.setPreferences(preferences);

    if (!this._useLocalStorage) {
      return preferences;
    }
  }
}
