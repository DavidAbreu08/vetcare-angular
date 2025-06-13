import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reschedule-confirm',
  imports: [
    MatButtonModule, 
    MatDialogActions, 
    MatDialogClose,
    MatDialogContent
  ],
  templateUrl: './reschedule-confirm.component.html',
  styleUrl: './reschedule-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RescheduleConfirmComponent {
  readonly dialogRef = inject(MatDialogRef<RescheduleConfirmComponent>);
}
