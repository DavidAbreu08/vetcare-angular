import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    @Inject(MAT_DIALOG_DATA) public data: { event: any },
    private readonly dialogRef: MatDialogRef<EventListComponent>
  ) {}

  public close() {
    this.dialogRef.close();
  }
}
