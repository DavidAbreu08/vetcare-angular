import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterInterface } from './interfaces/register.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpResponse } from '../../core/interfaces/http-response.interface';
import { LoginInterface } from './interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.api.url;

  constructor(private readonly http: HttpClient) { }

  //login(loginValues: LoginInterface): Observable<HttpResponse> {
    //return this.http.post<HttpResponse>(`${this.apiUrl}/login`, loginValues).pipe(
      //tap((response) => {
        //if (response.token) {
         // localStorage.setItem('token', response.token); // Armazena o token no localStorage
       // }
     // })
    //);
  //}

  register(registerValues: RegisterInterface): void | Observable<HttpResponse> {
    this.http.post<HttpResponse>(`${this.apiUrl}/users`, registerValues)
      .subscribe((response: HttpResponse) => {
        console.log(response)
      });
  }
}
