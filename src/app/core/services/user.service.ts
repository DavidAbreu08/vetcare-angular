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

  // might not need to do this decode on front end cause backend is already doing it with /auth/me
  public getDecodedPayload(token: string): any{
    try{
      const decoded = jwtDecode<JwtPayload>(token)
      return decoded;
    }catch{
      return null
    }
  }

  public getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/me`);
  }
}
