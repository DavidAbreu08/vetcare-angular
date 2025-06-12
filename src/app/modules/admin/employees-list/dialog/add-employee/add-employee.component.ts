import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { nifValidator } from '../../../../../core/validators/nif-validator';
import { UserService } from '../../../../../core/services/user.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-employee',
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule,
    MatDatepickerModule,
    MatDialogContent,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
  standalone: true
})
export class AddEmployeeComponent implements OnInit{
  public readonly dialogRef = inject(MatDialogRef<AddEmployeeComponent>);
  public addEmployeeForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
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
      function: [
        'Atendimento',
        [
          Validators.required,
        ]
      ],
      workLoad: [
        'Full-Time',
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

  get function() {
    return this.addEmployeeForm.get('function')
  }

  get workLoad() {
    return this.addEmployeeForm.get('workLoad')
  }

  public onSubmit(){
    if (this.addEmployeeForm.invalid) {
      this.notificationService.showError('Por favor, preencha corretamente todos os campos.');
      return;
    }
    
    const formData = this.addEmployeeForm.value;

    this.userService.createEmployee(formData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Funcionário criado com sucesso!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        const backendMessage = error?.error?.message || 'Erro ao adicionar funcionário. Tente novamente.';
        this.notificationService.showError(backendMessage);
      }
    });

  }

  public onNoClick(): void {
    this.dialogRef.close(true);
  }
}
