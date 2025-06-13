import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../../core/services/notification.service';
import { AnimalService } from '../../../../../core/services/animal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-animal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-animal.component.html',
  styleUrl: './edit-animal.component.scss',
})
export class EditAnimalComponent implements OnInit {
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<EditAnimalComponent>,
    private readonly notificationService: NotificationService,
    private readonly animalService: AnimalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.data.animal);

    this.form = this.fb.group({
      name: [''],
      breed: [''],
      age: [''],
      height: [''],
      weight: [''],
    });
    this.form.patchValue(this.data.animal);
  }
  get breed() {
    return this.form.get('breed');
  }
  get age() {
    return this.form.get('age');
  }
  get weight() {
    return this.form.get('weight');
  }
  get height() {
    return this.form.get('height');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.showError(
        'Introduza todos os campos obrigatórios'
      );
      return;
    }

    const id = this.data.animal.id;
    // Supondo que só pode alterar nome e idade:
    const updateDto = this.form.value;

    this.animalService.update(id, updateDto).subscribe({
      next: () => {
        this.notificationService.showSuccess("Animal atualizado com sucesso");
        this.dialogRef.close();
      },
      error: (err) => {
        this.notificationService.showError("Erro ao atualizar animal");
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
