import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { PasswordMatchValidator } from '../../../../../core/validators/password-match.validator';
import { nifValidator } from '../../../../../core/validators/nif-validator';

@Component({
  selector: 'app-add-employee',
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule,
    MatDatepickerModule,
    MatDialogContent
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent implements OnInit{
  public readonly dialogRef = inject(MatDialogRef<AddEmployeeComponent>);
  public addEmployeeForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
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
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
        ]
      ],      
      confirmPassword: [
        '', 
        [
          Validators.required,
        ]
      ],  
      nif: [
        '', 
        [
          Validators.required, 
          nifValidator(),
        ]
      ],
      dataBirth: [
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
    },
    {
      validators: PasswordMatchValidator('password', 'confirmPassword'),
    })
  }


  get name() {
    return this.addEmployeeForm.get('name')
  }

  get email() {
    return this.addEmployeeForm.get('email')
  }

  get password() {
    return this.addEmployeeForm.get('password')
  }

  get confirmPassword() {
    return this.addEmployeeForm.get('confirmPassword')
  }

  get nif() {
    return this.addEmployeeForm.get('nif')
  }

  get dataBirth() {
    return this.addEmployeeForm.get('dataBirth')
  }

  get phone() {
    return this.addEmployeeForm.get('phone')
  }

  public onSubmit(){

  }

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
