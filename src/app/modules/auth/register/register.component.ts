/*
 * File: register.component.ts
 * Project: VetCare
 * Created: Thursday, 13th February 2025 7:43:02 pm
 * Last Modified: Saturday, 15th February 2025 4:20:54 pm
 * Copyright © 2025 VetCare
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { PasswordMatchValidator } from '../validators/password-match.validator';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';

/**
 * Register Component
 * 
 * @class
 * @exports
 * @implements {OnInit}
 */
@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  public errorMessage: string = '';

  /**
   * Creates an instance of RegisterComponent
   * 
   * @param AuthService authService
   * 
   * @memberof RegisterComponent
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  /**
   * Calls root functions
   * 
   * @memberof RegisterComponent
   */
  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
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
    },
    {
      validators: PasswordMatchValidator('password', 'confirmPassword'),
    })
  }

  get firstName() {
    return this.registerForm.get('firstName')
  }

  get lastName() {
    return this.registerForm.get('lastName')
  }

  get email() {
    return this.registerForm.get('email')
  }

  get password() {
    return this.registerForm.get('password')
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')
  }

  public submit() {
    if (this.registerForm.invalid) {
        console.log("Por favor, preencha corretamente todos os campos.");
        return;
    }

    const { confirmPassword, ...formValues } = this.registerForm.value;

    this.authService.checkEmailExists(formValues.email).subscribe({
        next: (emailExists) => {
            if (emailExists) {
                this.errorMessage = 'Este email já está registrado.';
            } else {
                this.authService.register(formValues).subscribe({
                    next: (response) => {
                      this.router.navigate(['auth/login']);
                      console.log(response)
                    },
                    error: (err) => {
                      this.errorMessage = 'Verifique Se preencheu todos os campos corretor e tente novamente.';
                      console.log(err)
                    }
                });
            }
        },
        error: (err) => {
            this.errorMessage = 'Erro ao verificar email. Tente novamente.';
            console.log('Error checking email', err);
        }
    });
}
}
