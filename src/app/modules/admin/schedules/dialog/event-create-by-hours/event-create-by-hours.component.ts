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
  
  public onSave(): void {
    if (this.formEvent.valid) {
      const formValue = this.formEvent.getRawValue();
      const dto = {
        ownerId: formValue.clientId,
        animalId: formValue.animalId,
        date: new Date(`${formValue.date}T${formValue.startTime}:00`),
        time: formValue.startTime,
        reason: formValue.reason,
        employeeId: formValue.employeeId
      };
  
      this.reservationService.createReservation(dto).subscribe({
        next: (reservation) => {
          this.dialogRef.close(reservation);
        },
        error: (err) => {
          console.error('Error creating reservation:', err);
        }
      });
    }
  }
}
