/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestService } from './rest.service';
import { HttpParams, HttpRequest, HttpClientModule, HttpHeaders } from '@angular/common/http';

// TODO, skipping broken tests
// These tests generate the folloiwng error-
// "Disconnected, because no message in 30000 mS"
describe('RestService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      HttpClientModule
    ],
    providers: [RestService]
  }));

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created', () => {
    const restService: RestService = TestBed.inject(RestService);
    expect(restService).toBeTruthy();
  });

  // should call POST method
  it('should call post method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.post('https://test.com/api/test1', data).subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test1'
        && req.method === 'POST'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'POST to \'/api/test\' with username and password')
        .flush(null, { status: 200, statusText: 'OK' });
    })));

  it('should call postNonJson method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.postNonJson('https://test.com/api/test1', data).subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test1'
        && req.method === 'POST'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'POST to \'/api/test\' with username and password')
        .flush(null, { status: 200, statusText: 'OK' });
    })));

  it('should call postBlob method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.postBlob('https://test.com/api/test1', data).subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test1'
        && req.method === 'POST'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'POST to \'/api/test\' with username and password')
        .flush(null, { status: 200, statusText: 'OK' });
    })));

  // should call GET method
  it('should call GET method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      service.get('https://test.com/api/test2').subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test2').flush(null, { status: 200, statusText: 'OK' });
    })));

  // should call GET with HttpParams method
  it('should call GET with HttpParams method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.getWithHttpParams('https://test.com/api/test4', data).subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test4?username=testUser&password=123456').flush(null, { status: 200, statusText: 'OK' });
    })));

  it('should call modified GET method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      service.modifiedGet('https://test.com/api/test2').subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test2').flush(null, { status: 200, statusText: 'OK' });
    })));

  it('should call getString method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      service.getString('https://test.com/api/test2').subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test2').flush(null, { status: 200, statusText: 'OK' });
    })));

  it('should call getFile method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      service.getFile('https://test.com/api/test2').subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test2').flush(null, { status: 200, statusText: 'OK' });
    })));

  // should call PUT method
  it('should call PUT method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.put('https://test.com/api/test3', data).subscribe((next) => {
        expect(next.body).toEqual(true);
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test3'
        && req.method === 'PUT'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'POST to \'/api/test\' with username and password')
        .flush({ body: true }, { status: 200, statusText: 'OK' });
    })));

  it('should call modifed PUT method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.modifiedPut('https://test.com/api/test3', data).subscribe((next) => {
        expect(next.body).toEqual(true);
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test3'
        && req.method === 'PUT'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'POST to \'/api/test\' with username and password')
        .flush({ body: true }, { status: 200, statusText: 'OK' });
    })));

  // should call DELETE method
  it('should call DELETE method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      service.delete('https://test.com/api/test').subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      // mock backend
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test'
        && req.method === 'DELETE', 'DELETE to \'https://test.com/api/test\' with username and password')
        .flush(null, { status: 200, statusText: 'OK' });
    })));

  it('should call modified DELETE method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      service.modifiedDelete('https://test.com/api/test').subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      // mock backend
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test'
        && req.method === 'DELETE', 'DELETE to \'https://test.com/api/test\' with username and password')
        .flush(null, { status: 200, statusText: 'OK' });
    })));

  it('should call DELETE with body method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.deleteWithBody('https://test.com/api/test', data).subscribe((next) => {
        expect(next.body).toEqual(true);
      });
      // mock backend
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test'
        && req.method === 'DELETE'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'DELETE to \'https://test.com/api/test\' with username and password')
        .flush({ body: true }, { status: 200, statusText: 'OK' });
    })));

  it('should call Post with Http Params', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const body = new HttpParams().set('test', 'testbody');
      const tenantQuery = new HttpParams().set('tenant', 'testTenant');
      service.postWithHttpParams('https://test.com/api/test', body, tenantQuery).subscribe((next) => {
        expect(next.status).toEqual(200);
      });
      // mock backend
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test'
        && req.method === 'POST'
        && req.body.updates[0].param === 'test'
        && req.body.updates[0].value === 'testbody', 'POST to \'https://test.com/api/test\' with body and ternantQuery')
        .flush({ body: true }, { status: 200, statusText: 'OK' });
    })));

  it('should call Put with Http Params', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const body = new HttpParams().set('test', 'testbody');
      const tenantQuery = new HttpParams().set('tenant', 'testTenant');
      service.putWithHttpParams('https://test.com/api/test', body, tenantQuery).subscribe((next) => {
        expect(next.status).toEqual(200);
      });
      // mock backend
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test'
        && req.method === 'PUT'
        && req.body.updates[0].param === 'test'
        && req.body.updates[0].value === 'testbody', 'PUT to \'https://test.com/api/test\' with body and ternantQuery')
        .flush({ body: true }, { status: 200, statusText: 'OK' });
    })));

  it('should call post method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '12345');
      const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      service.post('https://test.com/api/test1', data, headers).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(401);
        expect(error.statusText).toEqual('Invalid Username/Password');
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test1'
        && req.method === 'POST'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '12345', 'POST to \'/api/test\' with username and password')
        .error(null, { status: 401, statusText: 'Invalid Username/Password' });
    })));

  it('should call postNonJson method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '12345');
      const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      service.postNonJson('https://test.com/api/test1', data, headers).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(401);
        expect(error.statusText).toEqual('Invalid Username/Password');
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test1'
        && req.method === 'POST'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '12345', 'POST to \'/api/test\' with username and password')
        .error(null, { status: 401, statusText: 'Invalid Username/Password' });
    })));

  it('should call postBlob method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '12345');
      const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      service.postBlob('https://test.com/api/test1', data, headers).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(401);
        expect(error.statusText).toEqual('Invalid Username/Password');
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test1'
        && req.method === 'POST'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '12345', 'POST to \'/api/test\' with username and password')
        .error(null, { status: 401, statusText: 'Invalid Username/Password' });
    })));

  it('should call Post with Http Params and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const body = new HttpParams().set('test', 'testbody');
      const tenantQuery = new HttpParams().set('tenant', 'testTenant');
      const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      service.postWithHttpParams('https://test.com/api/test', body, tenantQuery, headers).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(403);
      });
      // mock backend
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test'
        && req.method === 'POST'
        && req.body.updates[0].param === 'test'
        && req.body.updates[0].value === 'testbody', 'POST to \'https://test.com/api/test\' with body and ternantQuery')
        .error(null, { status: 403, statusText: 'Error' });
    })));

  it('should call putBlob method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.putBlob('https://test.com/api/test1', data).subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test1'
        && req.method === 'PUT'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'PUT to \'/api/test\' with username and password')
        .flush(null, { status: 200, statusText: 'OK' });
    })));

  it('should call putBlob method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      service.putBlob('https://test.com/api/test1', data, headers).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(403);
        expect(error.statusText).toEqual('Error');
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test1'
        && req.method === 'PUT'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'PUT to \'/api/test\' with username and password')
        .error(null, { status: 403, statusText: 'Error' });
    })));

  it('should call getFile method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      service.getFile('https://test.com/api/test2', headers).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test2').error(null, { status: 404, statusText: 'Not Found' });
    })));

  it('should call GET method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      service.get('https://test.com/api/test2').subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test2').error(null, { status: 404, statusText: 'Not Found' });
    })));

  it('should call GET with HttpParams method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.getWithHttpParams('https://test.com/api/test4', data).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test4?username=testUser&password=123456')
        .error(null, { status: 404, statusText: 'Not Found' });
    })));

  it('should call modified GET with HttpParams method', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.modifiedGetWithHttpParams('https://test.com/api/test4', data).subscribe((next) => {
        expect(next.status).toEqual(200);
        expect(next.statusText).toEqual('OK');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test4?username=testUser&password=123456').flush(null, { status: 200, statusText: 'OK' });
    })));

  it('should call modified GET with HttpParams method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.modifiedGetWithHttpParams('https://test.com/api/test4', data).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test4?username=testUser&password=123456')
        .error(null, { status: 404, statusText: 'Not Found' });
    })));

  it('should call getString method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      service.getString('https://test.com/api/test2').subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test2').error(null, { status: 404, statusText: 'Not Found' });
    })));

  it('should call modified GET method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      // call and wait response
      service.modifiedGet('https://test.com/api/test2').subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      // mock back-end
      backend.expectOne('https://test.com/api/test2').error(null, { status: 404, statusText: 'Not Found' });
    })));

  it('should call DELETE method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      service.delete('https://test.com/api/test').subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      // mock backend
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test'
        && req.method === 'DELETE', 'DELETE to \'https://test.com/api/test\' with username and password')
        .error(null, { status: 404, statusText: 'Not Found' });
    })));

  it('should call modified DELETE method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      service.modifiedDelete('https://test.com/api/test').subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      // mock backend
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test'
        && req.method === 'DELETE', 'DELETE to \'https://test.com/api/test\' with username and password')
        .error(null, { status: 404, statusText: 'Not Found' });
    })));

  it('should call DELETE with body method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.deleteWithBody('https://test.com/api/test', data).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(401);
        expect(error.statusText).toEqual('Invalid Username/Password');
      });
      // mock backend
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test'
        && req.method === 'DELETE'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'DELETE to \'https://test.com/api/test\' with username and password')
        .error(null, { status: 401, statusText: 'Invalid Username/Password' });
    })));

  it('should call PUT method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      service.put('https://test.com/api/test3', data).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test3'
        && req.method === 'PUT'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'POST to \'/api/test\' with username and password')
        .error(null, { status: 404, statusText: 'Not Found' });
    })));

  it('should call Put with Http Params and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const body = new HttpParams().set('test', 'testbody');
      const tenantQuery = new HttpParams().set('tenant', 'testTenant');
      const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      service.putWithHttpParams('https://test.com/api/test', body, tenantQuery, headers).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      // mock backend
      backend.expectOne((req: HttpRequest<any>) => req.url === 'https://test.com/api/test'
        && req.method === 'PUT'
        && req.body.updates[0].param === 'test'
        && req.body.updates[0].value === 'testbody', 'PUT to \'https://test.com/api/test\' with body and ternantQuery')
        .error(null, { status: 404, statusText: 'Not Found' });
    })));

  it('should call modifed PUT method and throw error', waitForAsync(inject([RestService, HttpTestingController],
    (service: RestService, backend: HttpTestingController) => {
      const data = new HttpParams()
        .set('username', 'testUser')
        .set('password', '123456');
      const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      const options = { headers: headers };
      const url = `${location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')}/api/test3`;
      service.modifiedPut('/api/test3', data, null, null, options).subscribe(() => { }, (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      });
      backend.expectOne((req: HttpRequest<any>) => req.url === url
        && req.method === 'PUT'
        && req.body.updates[0].param === 'username'
        && req.body.updates[1].param === 'password'
        && req.body.updates[0].value === 'testUser'
        && req.body.updates[1].value === '123456', 'POST to \'/api/test\' with username and password')
        .error(null, { status: 404, statusText: 'Not Found' });
    })));
});
