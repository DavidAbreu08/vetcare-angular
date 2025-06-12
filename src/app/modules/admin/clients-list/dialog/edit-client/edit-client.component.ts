import { Component, inject } from '@angular/core';
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
  selector: 'app-edit-client',
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.scss',
  providers: [provideNativeDateAdapter()],
  standalone: true,
})
export class EditClientComponent {
  public readonly dialogRef = inject(MatDialogRef<EditClientComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  public form!: FormGroup;

  public selectedImage: string | ArrayBuffer | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nif: ['', Validators.required],
      phone: ['', Validators.required],
      dateBirth: ['', Validators.required],
    });

    this.form.patchValue(this.data);
  }

  get name() {
    return this.form.get('name');
  }
  get nif() {
    return this.form.get('nif');
  }
  get phone() {
    return this.form.get('phone');
  }
  get dateBirth() {
    return this.form.get('dateBirth');
  }

  public onSubmit() {
    if (this.form.invalid) {
      this.notificationService.showError(
        'Por favor, preencha todos os campos obrigatórios.'
      );
      return;
    }

    const allowedFields = ['name', 'nif', 'phone', 'dateBirth'];
    const updatedClient: any = {};
    const original = this.data;

    allowedFields.forEach((field) => {
      if (
        this.form.get(field) &&
        this.form.get(field)?.value !== original[field]
      ) {
        updatedClient[field] = this.form.get(field)?.value;
      }
    });

    if (Object.keys(updatedClient).length === 0) {
      this.notificationService.showError('Nenhuma alteração detectada.');
      return;
    }

    this.userService.updateUser(original['id'], updatedClient).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cliente atualizado com sucesso!');
        this.dialogRef.close(true);
      },
      error: () => {
        this.notificationService.showError('Erro ao atualizar cliente.');
      },
    });
  }
}
