import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // Login Mock
            if (request.url.endsWith('login') && request.method === 'POST') {
                return this.mockLogin(request);
            }

            // Other Mocks go here
            if (request.url.endsWith('information') && request.method === 'GET') {
              return this.mockVersion();
            }
            // if (request.url.endsWith('/xxxx') && request.method === 'GET') {
            //    return this.mockXxxx(request);
            // }

            // pass through any other requests not handled above
            return next.handle(request);
        }))

            // call materialize and dematerialize to ensure delay even
            // if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }

    mockLogin(request: HttpRequest<any>): Observable<HttpEvent<any>> {
      //  console.log('Mock login called with username: ' + request.body.username + ' password: ' + request.body.password);
        // Only admin/admin or user1/user1 is allowd
        if ((request.body.username === 'admin') && (request.body.password === 'admin123')) {
            const body = {
                token: '123456'
            };
            return of(new HttpResponse({ status: 200, body: body }));
        } else if ((request.body.username === 'user1') && (request.body.password === 'user123')) {
            const body = {
                token: '7890123'
            };
            return of(new HttpResponse({ status: 200, body: body }));
        } else {
            // else return 401 bad request
            return throwError({ status: 401, error: { message: 'Invalid user' } });
        }
    }
    // Other mocks go here
    mockVersion(): Observable<HttpEvent<any>> {
      const lastVersion = {
        version: 'V11.02.00A021',
        project: 'EMS'
      };
      return of(new HttpResponse({status: 200, body: lastVersion}));
    }
    // mockXxxx(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    // }
  }

export let mockBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockBackendInterceptor,
    multi: true
};
