import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { RegisterInterface } from './interfaces/register.interface';
import { Observable, retry, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpResponse } from '../../core/interfaces/http-response.interface';
import { LoginInterface } from './interfaces/login.interface';
import { LoginResponse } from './interfaces/response.interface';
import { isPlatformBrowser } from '@angular/common';
import { ForgotPasswordInterface } from './interfaces/forgot-password.interface';
import { ResetPasswordInterface } from './interfaces/reset-password.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.api.url;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly http: HttpClient,
  ) { }

  public login(loginValues: LoginInterface): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, loginValues)
      .pipe(
        retry(2),
        tap((response) => {
          if (response?.token) {
            localStorage.setItem('token', response.token);
          } else {
            console.warn('Resposta do servidor não contém token ou user.');
          }
        }),
      );
  }
  

  public register(registerValues: RegisterInterface): Observable<HttpResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<HttpResponse>(`${this.apiUrl}/users`, registerValues, { headers })
      .pipe(
        tap(response => {
          console.log("User registered successfully", response);
        }),
      );
  }

  public getToken(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token')
    }
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  public checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/check-email?email=${email}`);
  }

  public forgotPassword(forgotValues: ForgotPasswordInterface): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, forgotValues);
  }

  public resetPassword(resetValues: ResetPasswordInterface): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/reset-password`, {
      resetToken: resetValues.token,
      newPassword: resetValues.newPassword,
      confirmNewPassword: resetValues.confirmNewPassword
    });
  }
  
}
