import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../../../core/services/user.service';
import { AnimalService } from '../../../../../core/services/animal.service';
import { ReservationService } from '../../../../../core/services/reservation.service';
import { CommonModule } from '@angular/common';
import { map, tap } from 'rxjs';
import { TimePickerComponent } from '../../../../../shared/time-picker/time-picker.component';

export interface DialogData {
  date: Date;
}

@Component({
  selector: 'app-schedule-event',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatDialogModule,
    TimePickerComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './schedule-event.component.html',
  styleUrls: ['./schedule-event.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

//TODO: Restrict the information that can be entered in the form fields. Right now everything has Any type
export class ScheduleEventComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ScheduleEventComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly date = this.data.date;

  public selectedTime: string | null = null;

  public clients: any[] = [];
  public animals: any[] = [];
  public employees: any[] = [];
  public dataString: string = '';

  public filterValue: string = '';

  public formEvent!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly animalService: AnimalService,
    private readonly reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.formEvent = this.fb.group({
      clientId: ['', Validators.required],
      animalId: ['', Validators.required],
      reason: ['', Validators.required],
      employee: [this.employees, Validators.required],
      dateInput: [this.date, Validators.required],
      time: ['', Validators.required],
    });

    this.loadClients();

    this.formEvent.get('clientId')?.valueChanges.subscribe(clientId => {
      this.animals = [];
      if (clientId) {
        this.animalService.getAnimalsByClient(clientId).subscribe((animals) => {
          this.animals = animals;
        });
      }
    });
    this.loadEmployeesAvailable(this.date);
  }

  get reason() {
    return this.formEvent.get('reason')
  }

  public filterOptions(event: any) {
    this.filterValue = event.value;
    this.loadClients();
  }

  public loadClients() {
    if (this.filterValue) {
      const searchTerm = this.filterValue.toLowerCase();
  
      this.userService.getAllClients()
        .pipe(
          map((clients: any[]) =>
            clients.filter(client =>
              client.name.toLowerCase().includes(searchTerm)
            )
          )
        )
        .subscribe((filteredClients) => {
          this.clients = filteredClients;
        });
    } else {
      this.userService.getAllClients().subscribe((clients) => {
        this.clients = clients;
      });
    }
  }

  public loadEmployeesAvailable(date: Date) {
    this.reservationService.getEmployees(date)
    .pipe(
      tap((employees) => {
        this.employees = employees;
      })
    ).subscribe();
  }

  public onTimeSelected(time: string) {
    this.selectedTime = time;
    this.formEvent.controls['time'].setValue(time);
  }


  public submitReservation() {
    if (this.formEvent.invalid){
      console.error('Form is invalid:', this.formEvent.errors);
      return;
    }

    const { clientId, animalId, reason, dateInput, employee } = this.formEvent.value;

    const reservationPayload = {
      ownerId: clientId,
      animalId,
      reason,
      date: dateInput,
      time: this.selectedTime,
      employeeId: employee,
    };
    console.log('Submitting reservation with payload:', reservationPayload);

    this.reservationService.createReservation(reservationPayload).subscribe({
      next: (response) => {
        console.log('Reservation created successfully:', response);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error creating reservation:', error);
      },
    });
  }
}
