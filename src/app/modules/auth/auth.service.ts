import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterInterface } from './interfaces/register.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpResponse } from '../../core/interfaces/http-response.interface';
import { LoginInterface } from './interfaces/login.interface';
import { LoginResponse } from './interfaces/response.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.api.url;

  constructor(private readonly http: HttpClient) { }

  login(loginValues: LoginInterface): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, loginValues)
      .pipe(
        tap((response) => {
          if (response?.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user)); // Armazena os detalhes do utilizador
          }
        }),
        catchError(this.handleError)
      );
  }

  register(registerValues: RegisterInterface): Observable<HttpResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<HttpResponse>(`${this.apiUrl}/users`, registerValues, { headers })
      .pipe(
        tap(response => {
          console.log("User registered successfully", response);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Erro ${error.status}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  isAuthenticated(): boolean {
    
    return false;
  }

  getUserRole(): string | null {
    const user = localStorage.getItem('userRole');
    if (user) {
      const userObj = JSON.parse(user);
      return userObj.role; 
    }
    return null;
  }
  
}
