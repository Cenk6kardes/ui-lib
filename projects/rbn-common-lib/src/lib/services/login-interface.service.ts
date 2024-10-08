import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

export interface LoginInterfaceService {

  // To be implemented in application specific service
  // Inject('LoginInterfaceService')

  // Login method.
  login(username: string, password: string): Observable<HttpResponse<any>>;

  // Login and change password method.
  changePassword(username: string, password: string, newpassword: string, newpassword2: string): Observable<HttpResponse<any>>;

  // Login response logic.
  isLoginSuccess(res: HttpResponse<any>): boolean;

  // Login and change password response logic.
  isChangePasswordSuccess(res: HttpResponse<any>): boolean;

  // Retrieves specific login error details
  getErrorMessage(res?: HttpResponse<any>): Observable<HttpResponse<any>>;

  // parses the response from getErrorMessage() to retrieve error message
  parseError(res: HttpResponse<any>): string;

  // parses the response from getErrorMessage() to determine if password change needed
  parsePasswordChange(res: HttpResponse<any>): boolean;
}

export interface GetInfoInterfaceService {

  // To be implemented in application spectific service
  // Inject('GetInfoInterfaceService')

  // Retrieve project and version information
  getInformation(): Observable<HttpResponse<any>>;

  // parses the response from getInformation() to retrieve project
  parseProject(res: HttpResponse<any>): string;

  // parses the response from getInformation() to retrieve version
  parseVersion(res: HttpResponse<any>): string;

  // parses the response from getInformation() to retrieve banner
  parseBanner(res: HttpResponse<any>): string;
}
