import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { 
  addMonths, subMonths, addWeeks, subWeeks, addDays, subDays,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  format,
  getDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleEventComponent } from './dialog/schedule-event/schedule-event.component';
import { ReservationService } from '../../../core/services/reservation.service';


type ViewMode = 'month' | 'week' | 'day';

@Component({
  selector: 'app-appointments',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {
  public currentDate: Date = new Date();
  public days: Date[] = [];
  public weekDays: string[] = [];
  public viewMode: ViewMode = 'month';

  constructor(
    private readonly dialog: MatDialog,
    private readonly reservationServie: ReservationService 
  ) {
    this.updateCalendar();
  }

  public changeCalendarType(type: ViewMode): void {
    this.viewMode = type;
    this.updateCalendar();
  }

  public  updateCalendar() {
    const weekStart = startOfWeek(new Date());
    this.weekDays = Array.from({ length: 7 }, (_, i) => 
      format(addDays(weekStart, i), 'EEE', { locale: ptBR }) 
    );

    if (this.viewMode === 'month') {
      this.generateMonthView();
    } else if (this.viewMode === 'week') {
      const start = startOfWeek(this.currentDate);
      const end = endOfWeek(this.currentDate);
      this.days = eachDayOfInterval({ start, end });
    } else {
      this.days = [this.currentDate];
    }
  }

  public generateMonthView() {
    const start = startOfMonth(this.currentDate);
    const end = endOfMonth(this.currentDate);
    const firstDayOfMonthIndex = getDay(start); 
    const startOfWeekDate = subDays(start, firstDayOfMonthIndex);
    const endOfWeekDate = endOfWeek(end);

    this.days = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });
  }

  public previous() {
    if (this.viewMode === 'month') {
      this.currentDate = subMonths(this.currentDate, 1);
    } else if (this.viewMode === 'week') {
      this.currentDate = subWeeks(this.currentDate, 1);
    } else {
      this.currentDate = subDays(this.currentDate, 1);
    }
    this.updateCalendar();
  }

  public next() {
    if (this.viewMode === 'month') {
      this.currentDate = addMonths(this.currentDate, 1);
    } else if (this.viewMode === 'week') {
      this.currentDate = addWeeks(this.currentDate, 1);
    } else {
      this.currentDate = addDays(this.currentDate, 1);
    }
    this.updateCalendar();
  }

  public getTitle(): string {
    if (this.viewMode === 'month') {
      return format(this.currentDate, 'MMMM yyyy', { locale: ptBR }); 
    } else if (this.viewMode === 'week') {
      return `Semana de ${format(this.currentDate, 'd MMM yyyy', { locale: ptBR })}`;
    } else {
      return format(this.currentDate, 'EEEE, d MMMM yyyy', { locale: ptBR });
    }
  }

  public formatDate(date: Date): string {
    return format(date, 'd');
  }

  public formatDateNormal(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  public isCurrentMonth(date: Date): boolean {
    return format(date, 'MM-yyyy') === format(this.currentDate, 'MM-yyyy');
  }

  public isToday(date: Date): boolean {
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  }

  public isPastDay(day: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDay = new Date(day);
    compareDay.setHours(0, 0, 0, 0);
    return compareDay < today;
  }

  public isSelected(date: string): void {
    this.dialog.open(ScheduleEventComponent, {
      data: { date },
    });
  }
}
