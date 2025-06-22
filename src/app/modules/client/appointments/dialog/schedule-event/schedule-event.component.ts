import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { UserInterface } from '../../../../../core/interfaces/user.interface';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AnimalService } from '../../../../../core/services/animal.service';
import { ReservationService } from '../../../../../core/services/reservation.service';

export interface DialogData {
  date: string;
  id: string;
}

@Component({
  selector: 'app-schedule-event',
  imports: [
    CommonModule,
    TranslateModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './schedule-event.component.html',
  styleUrl: './schedule-event.component.scss',
  providers: [provideNativeDateAdapter()],
  standalone: true
})

export class ScheduleEventComponent implements OnInit {
  public readonly dialogRef = inject(MatDialogRef<ScheduleEventComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  public form!: FormGroup;
  public animals: any[] = [];
  public userInfo: UserInterface = {} as UserInterface;

  constructor(
      private readonly fb: FormBuilder,
      private readonly animalService: AnimalService,
      private readonly reservationService: ReservationService,
      private readonly notificationService: NotificationService,

  ) {}
  
  ngOnInit(): void {
    console.log('Dialog data:', this.data);

    this.form = this.fb.group({
      animal: ['', Validators.required],
      date: [this.data.date, Validators.required],
      startTime: ['', Validators.required],
      description: ['', Validators.required],
    });

    // Simulate fetching animals and user info
    this.animalService.getAnimalsByClient(this.data.id).subscribe((animals) => {
      this.animals = animals;
      console.log('Fetched animals:', this.animals);
    });

  }

  get animal() {
    return this.form.get('animal');
  }
  get date() {
    return this.form.get('date');
  }
  get startTime() {
    return this.form.get('startTime');
  }
  get description() {
    return this.form.get('description');
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      if (!this.animal?.value) {
        this.notificationService.showError('Por favor, selecione um animal.');
        return;
      }
      this.notificationService.showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const startTimeStr = this.startTime?.value; // ex: '16:00'
    // Converter para Date e somar 30 minutos
    const [hours, minutes] = startTimeStr.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutos em ms
    const endTimeStr = endDate.toTimeString().slice(0,5); // 'HH:mm'

    const eventData = this.form.value;

    this.reservationService.createReservation({
      animalId: this.animal?.value,
      date: this.date?.value,
      timeStart: startTimeStr,
      timeEnd: endTimeStr,
      reason: this.description?.value,
    }).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Evento agendado com sucesso!');
        this.dialogRef.close(eventData);
      },
      error: (error) => {
        this.notificationService.showError('Está fora do Horário de funcionamento da Clínica');
        console.error('Erro ao agendar evento:', error);
      }
    });
  }

}
