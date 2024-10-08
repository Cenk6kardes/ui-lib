import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
import { RestService } from '../../services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  private httpTimeOut = 300000;

  constructor(private restService: RestService) {
  }

  getEvent(url) {
    // return this.restService.get(url);
    return of({
      'com.test.sample': [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' }
      ],
      'com.test.sample1': [
        { label: 'C', value: 'c' },
        { label: 'D', value: 'd' }
      ]
    });
  }
}

