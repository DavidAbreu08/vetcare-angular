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
import { UserInterface } from '../../../core/interfaces/user.interface';

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
    CommonModule
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
    private readonly authService: AuthService
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
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
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

  public submit() {
    if (this.registerForm.invalid) {
      console.log(this.registerForm.value)
      console.log("Por favor, preencha corretamente todos os campos.");
      return;
    }
    const { confirmPassword, ...formValues } = this.registerForm.value;
    console.log(formValues);
    this.authService.register(formValues).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
      },
      error: (err) => {
        this.errorMessage = 'Falha no registo. Tente novamente.';
        console.log('Registration failed', err);
      },
    });
  }
}
