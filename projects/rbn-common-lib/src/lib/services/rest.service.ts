/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private httpTimeOut = 300000;

  constructor(private httpClient: HttpClient) {
  }

  /**
     * Construct a POST request which interprets the body as JSON and returns the full response.
     *
     * @return an `Observable` of the `HttpResponse` for the request, with a body type of `Object`.
     */
  post(cmdStr: string, body: any, headerCustom?: HttpHeaders, withCredentials: boolean = true): Observable<HttpResponse<Object>> {

    const url: string = this.buildUrl(cmdStr);
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const obs = this.httpClient.post<HttpResponse<Object>>(url, body, {
      observe: 'response', responseType: 'json', headers: headerCustom ? headerCustom : headers,
      withCredentials: withCredentials
    })
      .pipe(tap((res: HttpResponse<Object>) => {
        this.successInterceptor(res);
      }, (error: HttpResponse<Object>) => {
        this.errorInterceptor(error);
      }));
    return obs;
  }

  postWithHttpParams(cmdStr: string, body: any, httpParams: HttpParams, headerCustom?: HttpHeaders): Observable<HttpResponse<Object>> {

    const url: string = this.buildUrl(cmdStr);
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const obs = this.httpClient.post<HttpResponse<Object>>(url, body, {
      observe: 'response', responseType: 'json',
      headers: headerCustom ? headerCustom : headers,
      params: httpParams
    })
      .pipe(tap((res: HttpResponse<Object>) => {
        this.successInterceptor(res);
      }, (error: HttpResponse<Object>) => {
        this.errorInterceptor(error);
      }));
    return obs;
  }

  /**
   * Construct a POST request which interprets the body as text and returns the full response.
   *
   * @return an `Observable` of the `HttpResponse` for the request, with a body type of `Object`.
   */
  postNonJson(cmdStr: string, body: any, headerCustom?: HttpHeaders, withCredentials: boolean = true): Observable<HttpResponse<string>> {

    const url: string = this.buildUrl(cmdStr);
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const obs = this.httpClient.post(url, body, {
      observe: 'response', responseType: 'text', headers: headerCustom ? headerCustom : headers,
      withCredentials: withCredentials
    })
      .pipe(tap((res: HttpResponse<string>) => {
        this.successInterceptor(res);
      }, (error: HttpResponse<string>) => {
        this.errorInterceptor(error);
      }));
    return obs;
  }

  /**
   * Construct a POST request which interprets the body as blob and returns the full response.
   *
   * @return an `Observable` of the `HttpResponse` for the request, with a body type of `Object`.
   */
  postBlob(cmdStr: string, body: any, headerCustom?: HttpHeaders, withCredentials: boolean = true,
    httpParams?: HttpParams): Observable<HttpResponse<Blob>> {
    const url: string = this.buildUrl(cmdStr);
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const obs = this.httpClient.post(url, body, {
      observe: 'response', responseType: 'blob', headers: headerCustom ? headerCustom : headers,
      params: httpParams,
      withCredentials: withCredentials
    })
      .pipe(tap((res: HttpResponse<Blob>) => {
        this.successInterceptor(res);
      }, (error: HttpResponse<string>) => {
        this.errorInterceptor(error);
      }));
    return obs;
  }

  /**
   * Construct a PUT request which interprets the body as blob and returns the full response.
   *
   * @return an `Observable` of the `HttpResponse` for the request, with a body type of `Object`.
   */
  putBlob(cmdStr: string, body: any, headerCustom?: HttpHeaders, withCredentials: boolean = true): Observable<HttpResponse<Blob>> {
    const url: string = this.buildUrl(cmdStr);
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const obs = this.httpClient.put(url, body, {
      observe: 'response', responseType: 'blob', headers: headerCustom ? headerCustom : headers,
      withCredentials: withCredentials
    })
      .pipe(tap((res: HttpResponse<Blob>) => {
        this.successInterceptor(res);
      }, (error: HttpResponse<string>) => {
        this.errorInterceptor(error);
      }));
    return obs;
  }


  /**
   * Construct a GET request which interprets the body as JSON and returns the full response.
   *
   * @return an `Observable` of the `HttpResponse` for the request, with a body type of `Object`.
   */
  getFile(cmdStr: string, headerCustom?: HttpHeaders, httpTimeOut: number = this.httpTimeOut): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Accept': 'application/octet-stream',
      'Accept-Encoding': 'gzip,deflate,br',
      'connection': 'keep-alive'
    });
    const obs = this.httpClient.get(cmdStr, {
      observe: 'response', responseType: 'blob',
      headers: headerCustom ? headerCustom : headers
    }).pipe(
      tap((res: HttpResponse<Object>) => {
        this.successInterceptor(res);
      }, (error: HttpResponse<Object>) => {
        this.errorInterceptor(error);
      }),
      timeout(httpTimeOut)
    );
    return obs;
  }

  /**
   * Construct a GET request which interprets the body as JSON and returns the full response.
   *
   * @return an `Observable` of the `HttpResponse` for the request, with a body type of `Object`.
   */
  get(cmdStr: string, httpTimeOut: number = this.httpTimeOut, withCredentials: boolean = true): Observable<HttpResponse<Object>> {

    const url: string = this.buildUrl(cmdStr);
    const obs = this.httpClient.get<HttpResponse<Object>>(url, { observe: 'response', responseType: 'json', withCredentials })
      .pipe(
        tap((res: HttpResponse<Object>) => {
          this.successInterceptor(res);
        }, (error: HttpResponse<Object>) => {
          this.errorInterceptor(error);
        }),
        timeout(httpTimeOut)
      );
    return obs;
  }

  /**
   * Construct a GET request which interprets the body as JSON and returns the full response.
   *
   * @return an `Observable` of the `HttpResponse` for the request, with a body type of `Object`.
   */
  getWithHttpParams(cmdStr: string, httpParams: HttpParams, httpTimeOut: number = this.httpTimeOut): Observable<HttpResponse<Object>> {

    const url: string = this.buildUrl(cmdStr);
    const obs = this.httpClient.get<HttpResponse<Object>>(url, { params: httpParams, observe: 'response', responseType: 'json' })
      .pipe(
        tap((res: HttpResponse<Object>) => {
          this.successInterceptor(res);
        }, (error: HttpResponse<Object>) => {
          this.errorInterceptor(error);
        }),
        timeout(httpTimeOut)
      );
    return obs;
  }

  modifiedGetWithHttpParams(cmdStr: string, httpParams: HttpParams,
    httpTimeOut: number = this.httpTimeOut, headers?: HttpHeaders): Observable<HttpResponse<Object>> {

    const url: string = this.buildUrl(cmdStr);
    const obs = this.httpClient.get<HttpResponse<Object>>(url, {
      params: httpParams, observe: 'response', responseType: 'json',
      headers: headers
    })
      .pipe(
        tap((res: HttpResponse<Object>) => {
          this.successInterceptor(res);
        }, (error: HttpResponse<Object>) => {
          this.errorInterceptor(error);
        }),
        timeout(httpTimeOut)
      );
    return obs;
  }

  /**
   * Construct a GET request which interprets the body as JSON and returns the full response.
   *
   * @return an `Observable` of the `HttpResponse` for the request, with a body type of `Object`.
   */
  getString(cmdStr: string, httpTimeOut: number = this.httpTimeOut): Observable<HttpResponse<Object>> {

    const url: string = this.buildUrl(cmdStr);
    const obs = this.httpClient.get<HttpResponse<Object>>(url, { observe: 'response', responseType: 'text' as 'json' })
      .pipe(
        tap((res: HttpResponse<Object>) => {
          this.successInterceptor(res);
        }, (error: HttpResponse<Object>) => {
          this.errorInterceptor(error);
        }),
        timeout(httpTimeOut)
      );
    return obs;
  }

  /**
* Construct a GET request which interprets the body as JSON and returns the full response.
*
* @return an `Observable` of the `HttpResponse` for the request, with a body type of `Object`.
*/
  modifiedGet(cmdStr: string, httpTimeOut: number = this.httpTimeOut,
    headers?: HttpHeaders, withCredentials: boolean = true): Observable<HttpResponse<Object>> {

    const url: string = this.buildUrl(cmdStr);
    const obs = this.httpClient.get<HttpResponse<Object>>(url, {
      observe: 'response', responseType: 'json', headers: headers,
      withCredentials: withCredentials
    })
      .pipe(
        tap((res: HttpResponse<Object>) => {
          this.successInterceptor(res);
        }, (error: HttpResponse<Object>) => {
          this.errorInterceptor(error);
        }),
        timeout(httpTimeOut)
      );
    return obs;
  }

  /**
   * Construct a DELETE request which interprets the body as JSON and returns the full response.
   *  cmdStr: contain id of object which need to delete
   * @return an `Observable`  for the request.
   */
  delete(cmdStr: string, param?: HttpParams, responseTypeParam: any = 'json') {
    const url: string = this.buildUrl(cmdStr);
    const obs = this.httpClient.delete<any>(url, { observe: 'response', responseType: responseTypeParam, params: param })
      .pipe(
        tap((res: HttpResponse<Object>) => {
          this.successInterceptor(res);
        }, (error: HttpResponse<Object>) => {
          this.errorInterceptor(error);
        }),
        timeout(this.httpTimeOut)
      );
    return obs;
  }
  /**
   * Construct a DELETE request which interprets the body as JSON and returns the full response.
   *  cmdStr: contain id of object which need to delete
   * @return an `Observable`  for the request.
   */
  modifiedDelete(cmdStr: string, headers?: HttpHeaders, param?: HttpParams, withCredentials: boolean = true) {
    const url: string = this.buildUrl(cmdStr);
    const obs = this.httpClient.delete<any>(url, {
      observe: 'response', responseType: 'json', params: param, headers: headers,
      withCredentials: withCredentials
    })
      .pipe(
        tap((res: HttpResponse<Object>) => {
          this.successInterceptor(res);
        }, (error: HttpResponse<Object>) => {
          this.errorInterceptor(error);
        }),
        timeout(this.httpTimeOut)
      );
    return obs;
  }

  /**
   * Construct a DELETE request which has body data and returns the full response.
   *  cmdStr: contain id of object which need to delete
   * @return an `Observable`  for the request.
   */
  deleteWithBody(cmdStr: string, bodyData?: any) {
    const url: string = this.buildUrl(cmdStr);
    const obs = this.httpClient.request<any>('DELETE', url, { body: bodyData })
      .pipe(
        tap((res: HttpResponse<Object>) => {
          this.successInterceptor(res);
        }, (error: HttpResponse<Object>) => {
          this.errorInterceptor(error);
        }),
        timeout(this.httpTimeOut)
      );
    return obs;
  }

  /**
   * Construct a PUT request which interprets the body as JSON and returns the full response.
   *  cmdStr: contain id of object which need to edit
   *  body as HttpParams
   * @return an `Observable`  for the request.
   */
  put(cmdStr: string, body: any) {
    const url: string = this.buildUrl(cmdStr);
    const obs = this.httpClient.put<any>(url, body)
      .pipe(
        tap((res: HttpResponse<Object>) => {
          this.successInterceptor(res);
        }, (error: HttpResponse<Object>) => {
          this.errorInterceptor(error);
        }),
        timeout(this.httpTimeOut)
      );
    return obs;
  }

  putWithHttpParams(cmdStr: string, body: any, httpParams: HttpParams, headerCustom?: HttpHeaders): Observable<HttpResponse<Object>> {
    const url: string = this.buildUrl(cmdStr);
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const obs = this.httpClient.put<HttpResponse<Object>>(url, body, {
      observe: 'response', responseType: 'json',
      headers: headerCustom ? headerCustom : headers,
      params: httpParams
    })
      .pipe(tap((res: HttpResponse<Object>) => {
        this.successInterceptor(res);
      }, (error: HttpResponse<Object>) => {
        this.errorInterceptor(error);
      }));
    return obs;
  }

  /**
  * Construct a PUT request which interprets the body as JSON and returns the full response.
  *  cmdStr: contain id of object which need to edit
  *  body as HttpParams
  * @return an `Observable`  for the request.
  */
  modifiedPut(cmdStr: string, body: any, headers?: HttpHeaders, param?: HttpParams, customHttpOptions?) {
    const url: string = this.buildUrl(cmdStr);
    let options = { headers: headers, params: param };
    if (customHttpOptions) {
      options = { ...options, ...customHttpOptions };
    }
    const obs = this.httpClient.put<any>(url, body, options)
      .pipe(
        tap((res: HttpResponse<Object>) => {
          this.successInterceptor(res);
        }, (error: HttpResponse<Object>) => {
          this.errorInterceptor(error);
        }),
        timeout(this.httpTimeOut)
      );
    return obs;
  }

  patchWithHttpParams(cmdStr: string, body: any, httpParams: HttpParams, headerCustom?: HttpHeaders): Observable<HttpResponse<Object>> {
    const url: string = this.buildUrl(cmdStr);
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    const obs = this.httpClient.patch<HttpResponse<Object>>(url, body, {
      observe: 'response', responseType: 'json',
      headers: headerCustom ? headerCustom : headers,
      params: httpParams
    })
      .pipe(tap((res: HttpResponse<Object>) => {
        this.successInterceptor(res);
      }, (error: HttpResponse<Object>) => {
        this.errorInterceptor(error);
      }));
    return obs;
  }
  private successInterceptor(res: HttpResponse<any>): void { }

  private errorInterceptor(res: HttpResponse<any>): void { }

  // Build the REST API URL
  private buildUrl(cmdStr: string): string {
    let url = '';
    if (cmdStr.startsWith('http') === true) {
      url = cmdStr; // hardcoded for development
    } else {
      url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + cmdStr;
    }
    return url;
  }
}
