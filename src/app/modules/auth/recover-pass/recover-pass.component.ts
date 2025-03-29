/*
 * File: recover-pass.component.ts
 * Project: VetCare
 * Created: Thursday, 13th February 2025 7:43:02 pm
 * Last Modified: Friday, 21st March 2025 4:26:05 pm
 * Copyright © 2025 VetCare
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ForgotPasswordInterface } from '../interfaces/forgot-password.interface';

@Component({
  selector: 'app-recover-pass',
  imports: [
    RouterLink,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  templateUrl: './recover-pass.component.html',
  styleUrl: './recover-pass.component.scss'
})
export class RecoverPassComponent {
  forgotForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ){
    this.forgotForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
    });
  }

  get email() {
    return this.forgotForm.get('email');
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;
  
    this.errorMessage = '';
  
    const forgotValues: ForgotPasswordInterface = this.forgotForm.value;
  
    this.authService.forgotPassword(forgotValues).subscribe({
      next: (res) => {
        this.router.navigate(['/auth/verify-email'], { queryParams: { email: forgotValues.email } });
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Something went wrong';
      },
      complete: () => {
        this.successMessage = 'Email sent successfully';
      }
    });
  }
}

