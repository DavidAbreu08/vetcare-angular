import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../core/services/reservation.service';
import { MatDialog } from '@angular/material/dialog';
import { RescheduleConfirmComponent } from './dialog/reschedule-confirm/reschedule-confirm.component';
import { NotificationService } from '../../../core/services/notification.service';

interface Appointment {
  id: string;
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
    private readonly reservationService: ReservationService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog
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
            id: appointment.id,
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

  public openRescheduleModal(appointment: any) {
    console.log(appointment);
    const dialogRef = this.dialog.open(RescheduleConfirmComponent, {
      width: '400px',
      data: { appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'accept') {
        const dto = {
          status: 'confirmed',
        };
        this.reservationService.confirmRescheduledReservation(appointment.id, dto).subscribe(() => {
          this.notificationService.showSuccess('Foi enviado um email da confirmação de reagendamento');
          this.ngOnInit(); // Refresh the appointments list
        });
      } else if (result === 'reject') {
        this.reservationService.rejectRescheduledReservation(appointment.id).subscribe(() => {
          this.notificationService.showSuccess('Foi enviado um email da recusa de reagendamento');
          this.ngOnInit(); // Refresh the appointments list
        });
      }
    });
  }
}
