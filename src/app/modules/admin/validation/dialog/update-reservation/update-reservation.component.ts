import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReservationService } from '../../../../../core/services/reservation.service';

@Component({
  selector: 'app-update-reservation',
  imports: [
    CommonModule
  ],
  templateUrl: './update-reservation.component.html',
  styleUrl: './update-reservation.component.scss'
})
export class UpdateReservationComponent implements OnInit {

  public formatedDate!: string;
  readonly dialogRef = inject(MatDialogRef<UpdateReservationComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(
    private readonly reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    const isoDate = this.data.reservation.date;
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    this.formatedDate = `${day}-${month}-${year}`;
  }

  public reservationAtDate(dayDate: string): void {
    //TODO: implement reservationAtDate method
    //this method will return all the reservations at that day, not specifing the employee
  }

}
