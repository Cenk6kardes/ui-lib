import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { button, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { RbnCommonLibModule, Headeralert } from '../../../../public_api';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderalertComponent } from './headeralert.component';
import { HeaderalertInterfaceService } from '../../../services/headeralert-interface.service';

class AlertServiceStub implements HeaderalertInterfaceService {
  public value$ = new BehaviorSubject(new Headeralert(2, 3, 4));
  getAlertCounts(): Observable<Headeralert> {
    return this.value$;
  }
}

const AlertServiceObj = new AlertServiceStub();
export default {
  title: 'Components/HeaderalertUsage',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RbnCommonLibModule
      ],
      providers: [
        { provide: 'HeaderalertInterfaceService', useValue: AlertServiceObj}
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

const updateValues = () => {
  const info = Math.round(Math.random() * 1000);
  const debug = Math.round(Math.random() * 1000);
  const error = Math.round(Math.random() * 1000);
  return AlertServiceObj.value$.next(new Headeralert(info, debug, error));
};

export const HeaderalertUsage = () => ({
  component: HeaderalertComponent,
  prop: {
    button: button('Update', updateValues)
  }
});
