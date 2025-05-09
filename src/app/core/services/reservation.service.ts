import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly apiUrl = environment.api.url;

  constructor(
    private readonly http: HttpClient,
  ) { }
  public createReservation(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservation/create`, dto);
  }

  getReservationsByClient(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservation/client`);
  }

  getReservationsByEmployee(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservation/employee`);
  }

  public getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservation/all`);
  }

  updateReservationStatus(id: string, dto: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservation/update-status/${id}`, dto);
  }

  public getEmployees(date: Date): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/available/${date}`);
  }
  

  public getReservations(employeeId: string, date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservation/${employeeId}/${date}`);
  }

  getClinicHours(): Observable<{ start: string, end: string }> {
    return this.http.get<any>(`${this.apiUrl}/clinic/hours`);
  }
}
