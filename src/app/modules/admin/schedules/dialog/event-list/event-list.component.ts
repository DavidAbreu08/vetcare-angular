import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventApi } from '@fullcalendar/core/index.js';

@Component({
  selector: 'app-event-list',
  imports: [
    CommonModule,
    
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { events: EventApi[]; date: string },
    private readonly dialogRef: MatDialogRef<EventListComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
