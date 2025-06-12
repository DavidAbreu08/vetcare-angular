import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../../../core/services/user.service';
import { NotificationService } from '../../../../../core/services/notification.service';

export interface DialogData {
  [key: string]: any;
}

@Component({
  selector: 'app-edit-employee',
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss',
  providers: [provideNativeDateAdapter()],
  standalone: true,
})
export class EditEmployeeComponent implements OnInit {
  public readonly dialogRef = inject(MatDialogRef<EditEmployeeComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  public form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      workLoad: ['Full-Time', Validators.required],
      nif: ['', Validators.required],
      phone: ['', Validators.required],
      function: ['none', Validators.required],
      isActive: ['true', Validators.required],
    });

    this.form.patchValue(this.data);
  }

  get name() {
    return this.form.get('name');
  }
  get workLoad() {
    return this.form.get('workLoad');
  }
  get nif() {
    return this.form.get('nif');
  }
  get phone() {
    return this.form.get('phone');
  }
  get function() {
    return this.form.get('function');
  }
  get isActive() {
    return this.form.get('isActive');
  }

  public onSubmit() {
    if (this.form.invalid) {
      this.notificationService.showError(
        'Por favor, preencha todos os campos obrigatórios.'
      );
      return;
    }

    const allowedFields = [
      'name',
      'nif',
      'phone',
      'workLoad',
      'function',
      'isActive',
    ];
    const updatedEmployee: any = {};
    const original = this.data;

    console.log('Original employee data:', original);

    allowedFields.forEach((field) => {
      if (
        this.form.get(field) &&
        this.form.get(field)?.value !== original[field]
      ) {
        updatedEmployee[field] = this.form.get(field)?.value;
      }
    });

    if (Object.keys(updatedEmployee).length === 0) {
      this.notificationService.showError('Nenhuma alteração detectada.');
      return;
    }

    this.userService.updateEmployee(original['id'], updatedEmployee).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          'Funcionário atualizado com sucesso!'
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.notificationService.showError('Erro ao atualizar funcionário.');
      },
    });
  }
}
