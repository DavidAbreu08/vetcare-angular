import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReservationService } from '../../../../../core/services/reservation.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { UpdateReservationComponent } from '../update-reservation/update-reservation.component';

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

  readonly dialogRef = inject(MatDialogRef<ReservationInfoComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(
    private readonly reservationService: ReservationService,
    private readonly fb: FormBuilder,
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

    this.reservationService.getAllReservations().pipe(
      tap((reservations) => {
        const reservationsOnDate = reservations.filter((r: any) => {
          const reservationDateString = new Date(r.date).toISOString().split('T')[0];
          return reservationDateString === selectedDateString && r.status === 'confirmed';
        });

        this.reservationsAtDate = reservationsOnDate;
      })
    ).subscribe();
  }

  private loadEmployeesAvailable(date: Date): void {
    this.reservationService.getEmployees(date).pipe(
      tap((employees) => {
        this.employees = employees;
      })
    ).subscribe();
  }

  public acceptReservation(): void {
    if( this.data.reservation.status === 'pending' ) {
      const employeeId = this.formSelectEmployee.value.employeeId;
      const reservationId = this.data.reservation.id;
      const dto = {
        employeeId: employeeId,
        status: 'confirmed',
        confirmationNote: this.formSelectEmployee.value.rescheduleNote,
      };

      this.reservationService.confirmPendingReservation(reservationId, dto).pipe(
        tap(() => {
          this.dialogRef.close(true);
        })
      ).subscribe();
    }

    if( this.data.reservation.status === 'rescheduled' ) {
      const reservationId = this.data.reservation.id;
      const dto = {
        status: 'confirmed',
        confirmationNote: this.formSelectEmployee.value.rescheduleNote,
      };

      this.reservationService.confirmRescheduledReservation(reservationId, dto).pipe(
        tap(() => {
          this.dialogRef.close(true);
        })
      ).subscribe();
    }
  }

  public newDateDialog(): void {
    this.dialog.open(UpdateReservationComponent, {
      minWidth: '500px',
      data: {
        reservation: this.data.reservation,
      }
    });
  }
}
