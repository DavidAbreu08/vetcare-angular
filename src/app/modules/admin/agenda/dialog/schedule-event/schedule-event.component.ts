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
      description: ['', Validators.required],
      employee: [null, Validators.required],
      dateInput: [this.date, Validators.required],
      time: ['', Validators.required],
    });

    this.loadClients();

    this.loadEmployeesAvailable(this.date); 

    this.formEvent.get('clientId')?.valueChanges.subscribe(clientId => {
      this.animals = [];
      if (clientId) {
        this.animalService.getAnimalsByClient(clientId).subscribe((animals) => {
          this.animals = animals;
        });
      }
    });

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
          tap((result: any) => console.log('All Clients:', result)),
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
    this.dataString = date.toISOString().split('T')[0];
    this.reservationService.getEmployees(this.dataString).pipe(
      tap((employees) => {
        console.log('All Employees:', employees);
        this.employees = employees;
      })
    ).subscribe();
  }

  public onTimeSelected(time: string) {
    this.selectedTime = time;
    this.formEvent.controls['time'].setValue(time);
  }


  public submitReservation() {
    if (this.formEvent.invalid) return;

    const { clientId, animalId, description, dateInput, time } = this.formEvent.value;

    const formattedDate = new Date(dateInput).toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const formattedTime = new Date(time).toTimeString().split(' ')[0].substring(0, 5); // 'HH:MM'

    const dto = {
      clientId,
      animalId,
      description,
      dateInput: formattedDate,
      time: formattedTime,
    };

    this.reservationService.createReservation(dto).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error(err)
    });
  }
}
