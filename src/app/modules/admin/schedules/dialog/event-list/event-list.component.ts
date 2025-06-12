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
  public reserva: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event?: any, reserva?: any },
    private readonly dialogRef: MatDialogRef<EventListComponent>
  ) {
    // Se vier do calendário, usa event; se vier do painel, usa reserva
    this.reserva = data.reserva || data.event;
    console.log('Reserva para detalhes:', this.reserva);
  }

  public close() {
    this.dialogRef.close();
  }
}
