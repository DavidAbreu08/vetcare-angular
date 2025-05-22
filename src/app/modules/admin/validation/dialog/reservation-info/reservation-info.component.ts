import { Component, inject, model } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ReservationService } from '../../../../../core/services/reservation.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { UpdateReservationComponent } from '../update-reservation/update-reservation.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-reservation-info',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './reservation-info.component.html',
  styleUrl: './reservation-info.component.scss',
})
export class ReservationInfoComponent {
  public formSelectEmployee!: FormGroup;
  public formatedDate!: string;
  public employees: any[] = [];
  public reservationsAtDate: any[] = [];

  dialog = inject(MatDialog);
  selectedDate = model<Date | null>(null);

  readonly dialogRef = inject(MatDialogRef<ReservationInfoComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  rescheduleData: {
    newDate?: Date;
    newTimeStart?: string;
    newTimeEnd?: string;
  } | null = null;

  constructor(
    private readonly reservationService: ReservationService,
    private readonly fb: FormBuilder,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.formSelectEmployee = this.fb.group({
      employeeId: ['', Validators.required],
      rescheduleNote: [''],
    });

    const isoDate = this.data.reservation.date;
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    this.formatedDate = `${day}-${month}-${year}`;

    this.loadEmployeesAvailable(dateObj);

    this.reservationAtDate();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public reservationAtDate(): void {
    const selectedDate = new Date(this.data.reservation.date);
    const selectedDateString = selectedDate.toISOString().split('T')[0];

    this.reservationService
      .getAllReservations()
      .pipe(
        tap((reservations) => {
          const reservationsOnDate = reservations.filter((r: any) => {
            const reservationDateString = new Date(r.date)
              .toISOString()
              .split('T')[0];
            return (
              reservationDateString === selectedDateString &&
              r.status === 'confirmed'
            );
          });

          this.reservationsAtDate = reservationsOnDate;
        })
      )
      .subscribe();
  }

  private loadEmployeesAvailable(date: Date): void {
    this.reservationService
      .getEmployees(date)
      .pipe(
        tap((employees) => {
          this.employees = employees;
        })
      )
      .subscribe();
  }

  public openRescheduleDialog(): void {
    const dialogRef = this.dialog.open(UpdateReservationComponent, {
      width: '500px',
      data: {
        currentDate: this.data.reservation.date,
        currentStart: this.data.reservation.startTime,
        currentEnd: this.data.reservation.endTime,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.rescheduleData = result;
      }
    });
  }

  public acceptReservation(): void {
    if (this.formSelectEmployee.invalid) return;

    const formValue = this.formSelectEmployee.value;
    console.log(formValue);
    const reservationId = this.data.reservation.id;

    if (
      this.data.reservation.status === 'pending' &&
      this.rescheduleData === null
    ) {
      const dto = {
        employeeId: formValue.employeeId,
        status: 'confirmed',
        confirmationNote: formValue.rescheduleNote,
      };

      this.reservationService
        .confirmPendingReservation(reservationId, dto)
        .pipe(
          tap(() => {
            this.notificationService.showSuccess('A sua reserva foi confirmada com sucesso!');
            this.dialogRef.close(true);
          })
        )
        .subscribe();
    }

    if (this.rescheduleData) {
      const dto = {
        ...this.rescheduleData,
        employeeId: formValue.employeeId,
        status: 'rescheduled',
        rescheduleNote: formValue.rescheduleNote,
      };

      this.reservationService
        .updateReservationStatus(reservationId, dto)
        .pipe(
          tap(() => {
            this.notificationService.showSuccess('A sua reserva foi reenviada com sucesso!');
            this.dialogRef.close(true);
          })
        )
        .subscribe();
    }

    if (this.data.reservation.status === 'rescheduled') {
      const reservationId = this.data.reservation.id;
      const dto = {
        status: 'confirmed',
        confirmationNote: formValue.rescheduleNote,
      };

      this.reservationService
        .confirmRescheduledReservation(reservationId, dto)
        .pipe(
          tap(() => {
            this.notificationService.showSuccess('A sua reserva foi confirmada com sucesso!');
            this.dialogRef.close(true);
          })
        )
        .subscribe();
    }
  }

  public canShowButton(): boolean {
    return !!(this.data.reservation.status === 'pending' || this.data.reservation.status === 'rescheduled')
  }
}
