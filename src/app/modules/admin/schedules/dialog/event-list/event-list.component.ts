import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-event-list',
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: any },
    private readonly dialogRef: MatDialogRef<EventListComponent>
  ) {
    console.log('Event List Data:', data);
  }

  public close() {
    this.dialogRef.close();
  }
}
