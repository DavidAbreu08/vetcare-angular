import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-update-reservation',
  imports: [
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
  ],
  templateUrl: './update-reservation.component.html',
  styleUrl: './update-reservation.component.scss'
})
export class UpdateReservationComponent implements OnInit {
  dialogRef = inject<MatDialogRef<UpdateReservationComponent>>(
    MatDialogRef<UpdateReservationComponent>,
  );
  data = inject(MAT_DIALOG_DATA);

  readonly date = new FormControl(new Date());

  constructor(
    
  ) {}

  ngOnInit(): void {
    this.date.valueChanges.subscribe(value => {
        console.log('Date changed:', value);
    });
  }
}
