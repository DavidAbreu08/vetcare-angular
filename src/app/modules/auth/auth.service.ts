import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { RegisterInterface } from './interfaces/register.interface';
import { Observable, retry, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpResponse } from '../../core/interfaces/http-response.interface';
import { LoginInterface } from './interfaces/login.interface';
import { LoginResponse } from './interfaces/response.interface';
import { ErrorService } from '../../core/services/error.service';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.api.url;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly http: HttpClient,
    private errorService: ErrorService
  ) { }

  login(loginValues: LoginInterface): Observable<LoginResponse> {
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
  

  register(registerValues: RegisterInterface): Observable<HttpResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<HttpResponse>(`${this.apiUrl}/users`, registerValues, { headers })
      .pipe(
        tap(response => {
          console.log("User registered successfully", response);
        }),
      );
  }

  getToken(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token')
    }
  }


  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
}
