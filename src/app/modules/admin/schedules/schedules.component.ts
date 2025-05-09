import { Component, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { TopBarComponent } from '../../../shared/top-bar/top-bar.component';
import { CommonModule } from '@angular/common';

import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from '../../../core/utils/event-utils';
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
    height: 800,
    timeZone: 'Europe/Lisbon',
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '07:00',
      endTime: '20:00',
    },
    slotMinTime: '07:00',
    slotMaxTime: '21:00',
    eventContent: (arg) => {
      return {
        html: `
          <div class="custom-event">
            <b>${arg.timeText}</b>
            <span>${arg.event.title}</span>
          </div>
        `
      };
    },
    selectAllow: (selectInfo) => {
      // Restrict selection to business hours
      const startHour = selectInfo.start.getHours();
      const endHour = selectInfo.end.getHours();
      const dayOfWeek = selectInfo.start.getDay();
      return (
        startHour >= 7 &&
        endHour <= 20 &&
        dayOfWeek >= 1 && // Monday (1) to Friday (5)
        dayOfWeek <= 5
      );
    },
    eventAllow: (event) => {
      // Allow events to be created or edited only on weekdays
      const dayOfWeek = event.start.getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    },
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    dateClick: this.handleDateClick.bind(this),
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
    this.reservationService.getAllReservations().subscribe(reservations => {
      const events = reservations.map(reservation => this.mapReservationToEvent(reservation));
      this.calendarOptions.update(options => ({
        ...options,
        events: events
      }));
    });
  }

  private mapReservationToEvent(reservation: any): EventInput {
    // Convert your API date/time to a format FullCalendar understands
    const startDateTime = new Date(reservation.date);
    const [hours, minutes] = reservation.time.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);
    
    // Calculate end time (assuming 30-minute appointments by default)
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);
  
    return {
      id: reservation.id,
      title: `${reservation.reason} - ${reservation.animal.name}`,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      extendedProps: {
        client: reservation.client.name,
        employee: reservation.employee.name,
        status: reservation.status,
        rescheduleNote: reservation.rescheduleNote,
        animal: reservation.animal.name
      },
      backgroundColor: this.getStatusColor(reservation.status),
      borderColor: this.getStatusColor(reservation.status)
    };
  }
  
  private getStatusColor(status: string): string {
    switch(status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#007bff';
    }
  }


  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
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

  handleEventClick(clickInfo: EventClickArg): void {
    const event = clickInfo.event;
    alert(`
      Title: ${event.title}
      Client: ${event.extendedProps['client']}
      Employee: ${event.extendedProps['employee']}
      Status: ${event.extendedProps['status']}
      Note: ${event.extendedProps['rescheduleNote']}
    `);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  handleDateClick(dateClickInfo: any) {
    // Filter events for the clicked day
    const selectedDate = dateClickInfo.dateStr;
    const eventsForDay = this.currentEvents().filter((event) => {
      return event.startStr.startsWith(selectedDate); // Match events by date
    });

    // Open the popup with the list of events
    this.dialog.open(EventListComponent, {
      data: { events: eventsForDay, date: selectedDate },
      width: '400px',
    });
  }
}
