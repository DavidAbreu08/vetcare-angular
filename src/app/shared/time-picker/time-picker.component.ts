import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { ReservationService } from '../../core/services/reservation.service';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TimePickerComponent implements OnChanges {

  @Input() selectedDate!: string;
  @Input() selectedEmployee!: any;
  @Output() timeSelected = new EventEmitter<string>();

  availableSlots: string[] = [];
  loading = false;
  error: string | null = null;

  readonly CLINIC_START = '09:00';
  readonly CLINIC_END = '18:00';

  constructor(private readonly reservationService: ReservationService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedDate && this.selectedEmployee) {
      this.fetchAvailableSlots();
    } else {
      this.availableSlots = [];
    }
  }

  fetchAvailableSlots() {
    this.loading = true;
    this.error = null;

    this.reservationService.getReservations(this.selectedEmployee.id, this.selectedDate)
      .pipe(
        catchError(() => {
          this.error = 'Erro ao carregar horários';
          return of([]);
        })
      )
      .subscribe(reservations => {
        this.loading = false;
        const booked = reservations.map(r => r.time);
        const allSlots = generateTimeSlots(this.CLINIC_START, this.CLINIC_END);
        this.availableSlots = allSlots.filter(slot => !booked.includes(slot));
      });
  }

  onSelect(time: string) {
    console.log('Horário selecionado:', time);
    this.timeSelected.emit(time);
  }

  handleSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target?.value;
  
    if (value) {
      this.onSelect(value);
    }
  }
}

function generateTimeSlots(start: string, end: string): string[] {
  const slots: string[] = [];
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  const slot = new Date();
  slot.setHours(startH, startM, 0, 0);
  const endTime = new Date();
  endTime.setHours(endH, endM, 0, 0);

  while (slot < endTime) {
    slots.push(slot.toTimeString().substring(0, 5));
    slot.setMinutes(slot.getMinutes() + 15);
  }

  return slots;
}
