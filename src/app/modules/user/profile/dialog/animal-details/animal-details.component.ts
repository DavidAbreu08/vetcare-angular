import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';


export interface DialogData {
  name: string;
  animal: any;
}

@Component({
  selector: 'app-animal-details',
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './animal-details.component.html',
  styleUrl: './animal-details.component.scss',
  providers: [provideNativeDateAdapter()],
  standalone: true
})
export class AnimalDetailsComponent {

  public readonly dialogRef = inject(MatDialogRef<AnimalDetailsComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  constructor(
  ) {
    console.log('Event List Data:', this.data.name);
    console.log('Event List Data:', this.data.animal);
  }

  public close() {
    this.dialogRef.close();
  }
}
