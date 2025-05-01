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
    this.reservationService.getAllReservations().subscribe((reservations) => {
      console.log('Reservations:', reservations); // Log all reservations
  
      const events: EventInput[] = reservations.map((reservation) => {
        console.log('Processing reservation:', reservation); // Log each reservation
  
        if (!reservation.date || !reservation.time) {
          console.error('Invalid reservation date or time:', reservation);
          return null;
        }
  
        // Combine date and time into a single ISO 8601 string
        const lisbonDateTime = `${reservation.date}T${reservation.time}`;
        console.log('Lisbon Date-Time:', lisbonDateTime);
  
        return {
          id: reservation.id,
          title: `${reservation.reason} - ${reservation.animal.name}`,
          start: lisbonDateTime, // Use the stored Lisbon date-time
          extendedProps: {
            client: reservation.client.name,
            employee: reservation.employee.name,
            status: reservation.status,
            rescheduleNote: reservation.rescheduleNote,
          },
        };
      }).filter(event => event !== null); // Filter out invalid events
  
      this.calendarOptions.update((options) => ({
        ...options,
        events, // Update events dynamically
      }));
  
      this.changeDetector.detectChanges(); // Trigger change detection
    });
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

  handleDateSelect(selectInfo: DateSelectArg) {
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
  
        calendarApi.unselect(); // Clear date selection
  
        calendarApi.addEvent({
          id: createEventId(),
          title: result.title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
        });
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
