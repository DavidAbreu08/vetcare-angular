import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

export interface DialogData {
  date: string;
}

@Component({
  selector: 'app-schedule-event',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogContent],
  templateUrl: './schedule-event.component.html',
  styleUrl: './schedule-event.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleEventComponent {
  readonly dialogRef = inject(MatDialogRef<ScheduleEventComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly date = this.data.date;

  constructor() {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
