import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnimalService } from '../../../../../core/services/animal.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DialogData } from '../../../../admin/agenda/dialog/schedule-event/schedule-event.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-animal',
  imports: [
    TranslateModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-animal.component.html',
  styleUrl: './add-animal.component.scss',
  providers: [provideNativeDateAdapter()],
  standalone: true
})
export class AddAnimalComponent implements OnInit{

  public readonly dialogRef = inject(MatDialogRef<AddAnimalComponent>);
  public animalForm!: FormGroup;

  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly userId = this.data;

  public selectedImage: string | ArrayBuffer | null = null;

  
  constructor(
    private readonly fb: FormBuilder,
    private readonly animalService: AnimalService,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.animalForm = this.fb.group({
    name: ['', Validators.required],
    species: ['', Validators.required],
    breed: ['', Validators.required],
    age: ['', Validators.required],
    weight: ['', Validators.required],
    height: ['', Validators.required],
    gender: ['none', Validators.required],
    observations: [''],
    image: [''],
    ownerId: [this.userId, Validators.required]
  });
  }

  get name() { return this.animalForm.get('name'); }
  get species() { return this.animalForm.get('species'); }
  get breed() { return this.animalForm.get('breed'); }
  get age() { return this.animalForm.get('age'); }
  get weight() { return this.animalForm.get('weight'); }
  get height() { return this.animalForm.get('height'); }
  get gender() { return this.animalForm.get('gender'); }
  get observations() { return this.animalForm.get('observations'); }
  get image() { return this.animalForm.get('image'); }
  get ownerId() { return this.animalForm.get('ownerId'); }

  public onFileSelected(event: any): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  // TODO: finish the fields on back end to complete submission.
  public onSubmit(): void {
    if (this.animalForm.invalid) {
      this.notificationService.showError('Por favor, preencha corretamente todos os campos.');
      return;
    }

    const animalData = { ...this.animalForm.value };

    // If an image was selected, add it to the payload
    if (this.selectedImage) {
      animalData.image = this.selectedImage;
    }

    this.animalService.addAnimal(animalData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Animal adicionado com sucesso!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.notificationService.showError('Erro ao adicionar animal.');
        console.error(err);
      }
    });
  }

  public onClose(): void {
    this.dialogRef.close(true);
  }
  

}
