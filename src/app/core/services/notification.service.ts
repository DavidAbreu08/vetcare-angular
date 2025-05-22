import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  public showSuccess(message: string) {
    this.notificationSubject.next({ type: 'success', message });
  }

  public showError(message: string) {
    this.notificationSubject.next({ type: 'error', message });
  }

  public showInfo(message: string) {
    this.notificationSubject.next({ type: 'info', message });
  }
}
