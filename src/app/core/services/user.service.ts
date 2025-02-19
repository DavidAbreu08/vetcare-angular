import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.api.url;

  public userInfo!: any

  constructor(
    private readonly http: HttpClient,
  ) { }

  public getDecodedPayload(token: string): any{
    try{
      const decoded = jwtDecode<JwtPayload>(token)
      return decoded;
    }catch{
      console.error('token invalid')
      return null
    }
  }

  public getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/me`);
  }
}
