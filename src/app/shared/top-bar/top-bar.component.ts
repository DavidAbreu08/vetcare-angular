import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../core/services/reservation.service';

interface Notification {
  message: string;
  link?: string;
  type: 'confirmed' | 'rescheduled';
}
@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent implements OnInit {
  public showNotifications = false;
  public showProfileDropdown = false;
  public notifications: Notification[] = [];

  /**
   * Constructor that injects ElementRef to detect clicks outside the component.
   *
   * @param elementRef Reference to the component's DOM element.
   */
  constructor(
    private readonly elementRef: ElementRef,
    private readonly reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    // Carregar notificações vistas do localStorage
    const cleared = localStorage.getItem('clearedNotifications');
    if (cleared === 'true') {
      this.notifications = [];
      return;
    }

    this.reservationService
      .getReservationsByClient()
      .subscribe((res: any[]) => {
        this.notifications = [];
        const now = new Date();

        res.forEach((appointment) => {
          const endDate = new Date(appointment.end);
          if (endDate >= now) {
            if (appointment.status === 'confirmed') {
              this.notifications.push({
                message: `A sua consulta para o dia ${new Date(
                  appointment.date
                ).toLocaleDateString()} foi confirmada.`,
                link: '/client/history',
                type: 'confirmed',
              });
            }
            if (appointment.status === 'rescheduled') {
              this.notifications.push({
                message: `A sua consulta para o dia ${new Date(
                  appointment.date
                ).toLocaleDateString()} foi reagendada.`,
                link: '/client/history',
                type: 'rescheduled',
              });
            }
          }
        });
      });
  }

  /**
   * Toggles the display of the notifications dropdown.
   * If activated, ensures the profile menu is closed.
   */
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;

    if (this.showNotifications) {
      this.showProfileDropdown = false;
    }
  }

  /**
   * Toggles the display of the user profile dropdown.
   * If activated, ensures the notifications menu is closed.
   */
  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;

    if (this.showProfileDropdown) {
      this.showNotifications = false;
    }
  }

  /**
   * Clears all notifications from the dropdown.
   * @returns void
   * This method empties the notifications array.
   * It can be called when the user clicks a "Clear" button in the notifications dropdown.
   */
  clearNotifications() {
    this.notifications = [];
    localStorage.setItem('clearedNotifications', 'true');
  }

  /**
   * Closes dropdowns when the user clicks outside the component.
   * @param event Click event captured on the document.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showNotifications = false;
      this.showProfileDropdown = false;
    }
  }
}
