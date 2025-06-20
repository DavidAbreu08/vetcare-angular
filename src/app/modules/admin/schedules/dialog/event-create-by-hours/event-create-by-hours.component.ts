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
import { map, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../../../core/services/notification.service';

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
    MatIconModule
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

  
  public filterValue: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { start: string; end: string; allDay: boolean },
    private readonly dialogRef: MatDialogRef<EventCreateByHoursComponent>,
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly animalService: AnimalService,
    private readonly reservationService: ReservationService,
    private readonly notificationService: NotificationService
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

  public filterOptions(event: any) {
    this.filterValue = event.value;
    this.loadClients();
  }

  private formatTime(dateTime: string): string {
    // Extract the time part and format it as HH:mm
    return dateTime.split('T')[1].slice(0, 5); // Removes seconds (e.g., "11:00:00" -> "11:00")
  }

  private loadClients(): void {
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

  private loadEmployeesAvailable(date: Date): void {
    this.reservationService.getEmployees(date).pipe(
      tap((employees) => {
        this.employees = employees;
      })
    ).subscribe();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
  
  public onSave(): void {
    if (this.formEvent.invalid) {
      this.notificationService.showError('Por favor, preencha corretamente todos os campos.');
      return;
    }
    if (this.formEvent.valid) {
      const formValue = this.formEvent.getRawValue();
      const dto = {
        animalId: formValue.animalId,
        ownerId: formValue.clientId,
        date: formValue.date,
        timeStart: formValue.startTime,
        timeEnd: formValue.endTime,
        reason: formValue.reason,
        employeeId: formValue.employeeId
      };
  
      this.reservationService.createReservation(dto).subscribe({
        next: (reservation) => {
          this.notificationService.showSuccess('Evento adicionado com sucesso!');
          this.dialogRef.close(reservation);
        },
        error: (error) => {
          const backendMessage = error?.error?.message || 'Erro ao adicionar Envento. Tente novamente.';
          this.notificationService.showError(backendMessage);
        }
      });
    }
  }
}
