import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReservationService } from '../../../../../core/services/reservation.service';
import { AnimalService } from '../../../../../core/services/animal.service';
import { UserService } from '../../../../../core/services/user.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-event-create-by-hours',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './event-create-by-hours.component.html',
  styleUrl: './event-create-by-hours.component.scss',
  standalone: true,
})
export class EventCreateByHoursComponent implements OnInit{
  public formEvent!: FormGroup;
  public clients: any[] = [];
  public animals: any[] = [];
  public employees: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { start: string; end: string; allDay: boolean },
    private readonly dialogRef: MatDialogRef<EventCreateByHoursComponent>,
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
      employeeId: ['', Validators.required],
      date: [{ value: this.data.start.split('T')[0], disabled: true }, Validators.required], // Pre-filled date
      startTime: [{ value: this.formatTime(this.data.start), disabled: true }, Validators.required], // Pre-filled start time
      endTime: [{ value: this.formatTime(this.data.end), disabled: true }, Validators.required], // Pre-filled end time
    });

    this.loadClients();

    this.formEvent.get('clientId')?.valueChanges.subscribe((clientId) => {
      this.animals = [];
      if (clientId) {
        this.animalService.getAnimalsByClient(clientId).subscribe((animals) => {
          this.animals = animals;
        });
      }
    });

    this.loadEmployeesAvailable(new Date(this.data.start));
  }

  private formatTime(dateTime: string): string {
    // Extract the time part and format it as HH:mm
    return dateTime.split('T')[1].slice(0, 5); // Removes seconds (e.g., "11:00:00" -> "11:00")
  }

  private loadClients(): void {
    this.userService.getAllClients().subscribe((clients) => {
      this.clients = clients;
    });
  }

  private loadEmployeesAvailable(date: Date): void {
    this.reservationService.getEmployees(date).pipe(
      tap((employees) => {
        this.employees = employees;
      })
    ).subscribe();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private convertToLisbonTime(localDateTime: string): string {
    try {
      const localDate = new Date(localDateTime);
  
      // Convert to Europe/Lisbon time zone
      const lisbonDateTime = new Date(
        localDate.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' })
      );
  
      // Format as ISO string (YYYY-MM-DDTHH:mm:ss)
      return lisbonDateTime.toISOString().slice(0, 19);
    } catch (error) {
      console.error('Error converting to Lisbon time zone:', { localDateTime, error });
      throw error;
    }
  }
  
  public onSave(): void {
    if (this.formEvent.invalid) {
      console.error('Form is invalid:', this.formEvent.errors);
      return;
    }
  
    const { clientId, animalId, reason, employeeId } = this.formEvent.value;
  
    // Convert local date and time to Europe/Lisbon time zone
    const lisbonDateTime = this.convertToLisbonTime(this.data.start);
  
    const reservationPayload = {
      ownerId: clientId,
      animalId,
      reason,
      date: lisbonDateTime.split('T')[0], // Extract the Lisbon date (YYYY-MM-DD)
      time: lisbonDateTime.split('T')[1], // Extract the Lisbon time (HH:mm:ss)
      employeeId,
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
