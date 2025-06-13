import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { PhotoDefault } from '../../../../../core/interfaces/photo-default';
import { EditAnimalComponent } from '../edit-animal/edit-animal.component';


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

  public readonly dialog = inject(MatDialog);

  public photoDefault: PhotoDefault = {
      dog: '../../../../../../assets/images/dog-default.png',
      cat: '../../../../../../assets/images/cat-default.png',
      rabbit: '../../../../../../assets/images/rabbit-default.png',
      bird: '../../../../../../assets/images/bird-default.png'
  };


  public getAnimalPhoto(animal: any): string {
    if (animal.image && animal.image.trim() !== '') {
      return animal.image;
    }

    switch (animal.type) {
      case 'dog':
        return this.photoDefault.dog;
      case 'cat':
        return this.photoDefault.cat;
      case 'rabbit':
        return this.photoDefault.rabbit;
      case 'bird':
        return this.photoDefault.bird;
      default:
        return '../../../../assets/icons/user-avatar.png';
    }
  }

  public editAnimalDialog(animal: any) {
    this.dialog.open(EditAnimalComponent, { data: { animal } });
  }

  public close() {
    this.dialogRef.close();
  }
}
