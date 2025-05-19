import { Component, OnInit } from '@angular/core';
import { Notification, NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [
    CommonModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  notification: Notification | null = null;
  show = false;
  timeout: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe(notification => {
      this.notification = notification;
      this.show = true;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.show = false, 3000);
    });
  }
}
