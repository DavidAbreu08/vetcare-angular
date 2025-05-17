import { Component, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { TopBarComponent } from '../../../shared/top-bar/top-bar.component';
import { CommonModule } from '@angular/common';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, DateSpanApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';
import { EventListComponent } from './dialog/event-list/event-list.component';
import { EventCreateByHoursComponent } from './dialog/event-create-by-hours/event-create-by-hours.component';
import { ReservationService } from '../../../core/services/reservation.service';


@Component({
  selector: 'app-schedules',
  imports: [
    TopBarComponent,
    CommonModule,
    FullCalendarModule,
  ],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss',
  standalone: true,
})
export class SchedulesComponent implements OnInit {
  calendarVisible = signal(true);
  isLoading = signal(false);
  error = signal<string | null>(null);

  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'timeGridWeek',
    events: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    height: 'auto',
    aspectRatio: 1.8,
    timeZone: 'local',
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '07:00',
      endTime: '20:00',
    },
    slotMinTime: '06:00',
    slotMaxTime: '21:00',
    slotDuration: '00:30:00',
    allDaySlot: false,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    eventDisplay: 'block',
    eventContent: this.customEventContent.bind(this),
    selectAllow: this.validateSelection.bind(this),
    eventAllow: this.validateEvent.bind(this),
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    datesSet: this.handleDateRangeChange.bind(this)
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly dialog: MatDialog,
    private readonly reservationService: ReservationService,
  ) {
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  private loadReservations(): void {
  this.isLoading.set(true);
  this.error.set(null);

  this.reservationService.getAllReservations().subscribe({
    next: (reservations) => {
      const events = reservations.map(reservation => 
        this.mapReservationToEvent(reservation)
      ).filter(event => event !== null);
      
      this.calendarOptions.update(options => ({
        ...options,
        events: events
      }));
    },
    error: (err) => {
      console.error('Failed to load reservations:', err);
      this.error.set('Failed to load reservations. Please try again later.');
    },
    complete: () => {
      this.isLoading.set(false);
    }
  });
  }

  private mapReservationToEvent(reservation: any): EventInput | null {
    
    // Combine with time strings
    const startDateTime = new Date(reservation.start);
    const endDateTime = new Date(reservation.end);

    // Validate dates
    if (isNaN(startDateTime.getTime())) {
      console.error('Invalid start date/time:', reservation.date, reservation.timeStart);
      return null;
    }
    if (isNaN(endDateTime.getTime())) {
      console.error('Invalid end date/time:', reservation.date, reservation.timeEnd);
      return null;
    }

    return {
      id: reservation.id,
      title: `${reservation.reason} - ${reservation.animal?.name ?? 'Unknown'}`,
      start: startDateTime,
      end: endDateTime,
      extendedProps: {
        client: reservation.client?.name ?? 'Unknown',
        employee: reservation.employee?.name ?? 'Unknown',
        status: reservation.status,
        rescheduleNote: reservation.rescheduleNote,
        animal: reservation.animal?.name ?? 'Unknown',
        reason: reservation.reason
      },
      backgroundColor: this.getStatusColor(reservation.status),
      borderColor: this.getStatusColor(reservation.status),
      classNames: ['custom-event']
    };
  }

  private customEventContent(arg: any): { html: string } {
    const timeText = arg.timeText;
    const client = arg.event.extendedProps.client;
    const animal = arg.event.extendedProps.animal;
    const status = arg.event.extendedProps.status;
    
    return {
      html: `
        <div class="fc-event-content" data-status="${status}">
          <div class="fc-event-time">${timeText}</div>
          <div class="fc-event-title">${client} - ${animal}</div>
        </div>
      `
    };
  }

  private validateSelection(span: DateSpanApi): boolean {
    const start = span.start;
    const end = span.end;
    const durationMs = end.getTime() - start.getTime();
    
    // Validate business hours
    const dayOfWeek = start.getDay();
    const startHour = start.getHours();
    const endHour = end.getHours();
    
    return (
      dayOfWeek >= 1 && 
      dayOfWeek <= 5 &&
      startHour >= 7 &&
      endHour <= 20 &&
      durationMs >= 30 * 60 * 1000 && // Minimum 30 minutes
      durationMs <= 4 * 60 * 60 * 1000 // Maximum 4 hours
    );
  }

  private validateEvent(event: any): boolean {
    const start = event.start;
    const dayOfWeek = start.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }

  public handleDateSelect(selectInfo: DateSelectArg) {
    const dialogRef = this.dialog.open(EventCreateByHoursComponent, {
      data: {
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      },
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();
        
        // Refresh events after creation
        this.loadReservations();
      }
    });
  }

  private handleEventClick(clickInfo: EventClickArg): void {
    const dialogRef = this.dialog.open(EventListComponent, {
      data: {
        event: clickInfo.event.toPlainObject()
      },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.loadReservations();
      }
    });
  }

  private handleEvents(events: EventApi[]): void {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  private handleDateRangeChange(info: any): void {
    // Optional: Load events for visible range
    //console.log('Date range changed', info.start, info.end);
  }

  private getStatusColor(status: string): string {
    const mapStatus = status.toLowerCase();
    switch(mapStatus) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#007bff';
    }
  }
}
