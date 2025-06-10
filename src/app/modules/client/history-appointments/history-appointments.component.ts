import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../core/services/reservation.service';

interface Appointment {
  date: string;
  animalName: string;
  reason: string;
  status?: string;
}

@Component({
  selector: 'app-history-appointments',
  imports: [
    CommonModule
  ],
  templateUrl: './history-appointments.component.html',
  styleUrl: './history-appointments.component.scss',
  standalone: true,
})
export class HistoryAppointmentsComponent implements OnInit {
  activeAppointments: Appointment[] = [];
  historyAppointments: Appointment[] = [];

  constructor(
    private readonly reservationService: ReservationService
  ) {}

  ngOnInit(): void {

    this.reservationService
      .getReservationsByClient()
      .subscribe((res: any[]) => {
        const now = new Date();

        this.activeAppointments = [];
        this.historyAppointments = [];

        res.forEach((appointment: any) => {
          const endDate = new Date(appointment.end);

          const item: Appointment = {
            date: appointment.date,
            animalName: appointment.animal?.name ?? '',
            reason: appointment.reason,
            status: appointment.status
          };

          if (endDate > now) {
            this.activeAppointments.push(item);
          } else {
            this.historyAppointments.push(item);
          }
        });
      });
  }
}
