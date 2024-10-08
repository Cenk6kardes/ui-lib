import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { object } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { HttpLoaderFactory } from '../../../shared/http-loader';
import { SearchGlobalModule } from '../search-global.module';
import { SearchGlobalComponent } from './search-global.component';

@Component({
  selector: 'rbn-search-global-story',
  template: `<rbn-search-global [searchConfig]="searchConfig" (inputValueEvent)="inputValueEvent($event)" 
  (clearBtnEvent)="clearBtnEvent($event)"></rbn-search-global>`
})

class SearchGlobalStoryComponent {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  searchConfig = {
    searchData: ''
  };

  inputValueEvent(event) {
    console.log('inputValueEvent', event);
  }

  clearBtnEvent(event) {
    console.log('clearBtnEvent', event);
    this.searchConfig.searchData = '';
  }
}

export default {
  title: 'Components/SearchGlobal',
  decorators: [
    moduleMetadata({
      declarations: [SearchGlobalStoryComponent],
      imports: [
        SearchGlobalModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ]
    })
  ],
  parameters: {
    backgrounds: {
      default: 'lightgrey',
      values: [
        { name: 'lightgrey', value: 'lightgrey' },
        { name: 'blue', value: '#3b5998' }
      ]
    }
  }
};

export const SearchGlobal = () => ({
  template: '<rbn-search-global-story></rbn-search-global-story>'
});
