import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-update-reservation',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIcon,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  templateUrl: './update-reservation.component.html',
  styleUrl: './update-reservation.component.scss',
})
export class UpdateReservationComponent implements OnInit {
  rescheduleForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      currentDate: Date;
      currentStart: string;
      currentEnd: string;
    },
    private readonly dialogRef: MatDialogRef<UpdateReservationComponent>
  ) {
    // Initialize form in constructor after fb is available
    this.rescheduleForm = this.fb.group({
      newDate: [null as Date | null, Validators.required],
      newTimeStart: ['', [Validators.required]],
      newTimeEnd: ['', [Validators.required]],
    });
  }

  get newDate() {
    return this.rescheduleForm.get('newDate');
  }

  get newTimeStart() {
    return this.rescheduleForm.get('newTimeStart');
  }

  get newTimeEnd() {
    return this.rescheduleForm.get('newTimeEnd');
  }

  ngOnInit(): void {
    this.rescheduleForm.patchValue({
      newDate: this.data.currentDate,
      newTimeStart: this.data.currentStart,
      newTimeEnd: this.data.currentEnd,
    });
  }

  public onSubmit(): void {
    if (this.rescheduleForm.valid) {
      console.log('Submitting:', this.rescheduleForm.value);
      this.dialogRef.close(this.rescheduleForm.value);
    }
  }
}
