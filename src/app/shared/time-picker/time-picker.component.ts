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
  error: string | null = null;

  constructor(private readonly reservationService: ReservationService) {}

  public ngOnChanges(changes: SimpleChanges) {
    const employeeChanged = changes['selectedEmployee'];
    if (employeeChanged && this.selectedEmployee && Array.isArray(this.selectedEmployee) === false) {
      this.fetchAvailableSlots();
    }
  }

  public fetchAvailableSlots() {
    this.error = null;

    this.reservationService.getReservations(this.selectedEmployee, this.selectedDate)
      .pipe(
        catchError(() => {
          this.error = 'Erro ao carregar horários';
          return of([]);
        })
      )
      .subscribe(slots => {
        this.availableSlots = slots;
      });
  }

  public onSelect(time: string) {
    console.log('Horário selecionado:', time);
    this.timeSelected.emit(time);
  }

  public handleSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target?.value;
  
    if (value) {
      this.onSelect(value);
    }
  }
}