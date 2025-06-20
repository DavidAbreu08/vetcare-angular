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

  public getReservationsByClient(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservation/client`);
  }

  public getReservationsByEmployee(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservation/employee`);
  }

  public getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservation/all`);
  }

  public updateReservationStatus(id: string, dto: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservation/update-status/${id}`, dto);
  }

  public getEmployees(date: Date): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/available/${date}`);
  }
  

  public getReservations(employeeId: string, date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservation/${employeeId}/${date}`);
  }
  
  public getClinicHours(): Observable<{ start: string, end: string }> {
    return this.http.get<any>(`${this.apiUrl}/clinic/hours`);
  }

  public confirmPendingReservation(employeeId: string, dto:any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservation/${employeeId}/confirm-pending`, dto);
  }

  public confirmRescheduledReservation(employeeId: string, dto:any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservation/${employeeId}/confirm-rescheduled`, dto);
  }

  public rejectRescheduledReservation(id: string, note?: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/reservation/${id}/reject-rescheduled`, { note });
}
}
