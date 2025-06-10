import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../../core/services/user.service';
import { nifValidator } from '../../../../../core/validators/nif-validator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-add-clients',
  imports: [
    TranslateModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule,
    MatDatepickerModule,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  templateUrl: './add-clients.component.html',
  styleUrl: './add-clients.component.scss',
  standalone: true,
})
export class AddClientsComponent {
  public readonly dialogRef = inject(MatDialogRef<AddClientsComponent>);
  public addEmployeeForm!: FormGroup;
  public errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ){
  }

  ngOnInit() {
    this.addEmployeeForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ], 
      nif: [
        '', 
        [
          Validators.required, 
          nifValidator(),
        ]
      ],
      dateBirth: [
        '',
        [
          Validators.required,
        ]
      ],
      phone: [
        '',
        [
          Validators.required,
        ]
      ],
    })
  }


  get name() {
    return this.addEmployeeForm.get('name')
  }

  get email() {
    return this.addEmployeeForm.get('email')
  }

  get nif() {
    return this.addEmployeeForm.get('nif')
  }

  get dateBirth() {
    return this.addEmployeeForm.get('dateBirth')
  }

  get phone() {
    return this.addEmployeeForm.get('phone')
  }



  public onSubmit(){
    if (this.addEmployeeForm.invalid) {
      this.notificationService.showError('Por favor, preencha corretamente todos os campos.');
      return;
    }

    const formData = this.addEmployeeForm.value;


    this.userService.createClient(formData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Cliente criado com sucesso!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        const backendMessage = error?.error?.message || 'Erro ao adicionar cliente. Tente novamente.';
        this.notificationService.showError(backendMessage);
      }
    });

  }

  public onNoClick(): void {
    this.dialogRef.close(true);
  }

}
