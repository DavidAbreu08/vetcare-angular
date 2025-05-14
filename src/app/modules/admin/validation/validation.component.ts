import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReservationService } from '../../../core/services/reservation.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdateReservationComponent } from './dialog/update-reservation/update-reservation.component';
import { ReservationInfoComponent } from './dialog/reservation-info/reservation-info.component';

@Component({
  selector: 'app-validation',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.scss',
  standalone: true,
})
export class ValidationComponent implements OnInit{

  public countPending: number = 0;
  public countRescheduled: number = 0;
  public countCancelled: number = 0;
  public reservationsPending: any[] = [];
  public reservationsRescheduled: any[] = [];
  public reservationsCancelled: any[] = [];

  constructor(
    private readonly reservationService: ReservationService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.verifyPendingReservation();
    this.verifyRescheduledReservation();
    this.verifyCancelledReservation();
  }

  public verifyPendingReservation() : void {
    this.reservationService.getAllReservations().subscribe((reservations) => {
      this.reservationsPending = reservations.filter((r: any) => r.status === 'pending');
      this.countPending = this.reservationsPending.length;
    }, (error) => {
      console.error('Error fetching reservations:', error);
    });
  }

  public verifyRescheduledReservation() : void {
    this.reservationService.getAllReservations().subscribe((reservations) => {
      this.reservationsRescheduled = reservations.filter((r: any) => r.status === 'rescheduled');
      this.countRescheduled = this.reservationsRescheduled.length;
    }, (error) => {
      console.error('Error fetching reservations:', error);
    });
  }

  public verifyCancelledReservation() : void {
    this.reservationService.getAllReservations().subscribe((reservations) => {
      this.reservationsCancelled = reservations.filter((r: any) => r.status === 'cancelled');
      this.countCancelled = this.reservationsCancelled.length;
    }, (error) => {
      console.error('Error fetching reservations:', error);
    });
  }


  public openDialog(reservation: any, index: number): void {
    this.dialog.open(ReservationInfoComponent, {
      data: {
        reservation,
        index
      }
    });
  }

  public toggle(reservation: any, index: number): void {
    console.log('Toggled reservation:', reservation);
    console.log('Reservation index:', index);
    // You can now use the reservation object or index as needed
  }
}
