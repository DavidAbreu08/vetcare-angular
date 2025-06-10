import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.api.url;

  public userInfo!: any
  public allEmplyees!: any

  constructor(
    private readonly http: HttpClient,
  ) {}


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
    return this.http.get(`${this.apiUrl}/auth/me`).pipe(
      tap((user) => (this.userInfo = user)),
      shareReplay(1)
    );
  }

  public getRole(): string | null{
    return this.userInfo ? this.userInfo.role : null;
  }

  public getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/clients`);
  }

  public getAllEmployees(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/auth/employees`).pipe(
      map((employees: any[]) => 
        employees.map(employee => ({ 
          ...employee, 
          createdAt: employee.createdAt.split("T")[0]
        }))
      ),
    );
  }

  public createEmployee(employeeData: any) {
    return this.http.post(`${this.apiUrl}/users/employees`, employeeData);
  }

  public createClient(clientData: any) {
    return this.http.post(`${this.apiUrl}/users/create-clients`, clientData);
  }

  public updateUser(userId: string, userData: UserInterface){
    return this.http.patch(`${this.apiUrl}/users/${userId}`, userData);
  }

}
