import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { PasswordMatchValidator } from '../validators/password-match.validator';
import { ResetPasswordInterface } from '../interfaces/reset-password.interface';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  public resetForm!: FormGroup;
  token: string | null = null;
  public errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required, 
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
      ]],
      confirmNewPassword: ['', [
          Validators.required,
      ]],
    },{
        validators: PasswordMatchValidator('newPassword', 'confirmNewPassword'),
    });
  }

  get newPassword() {
    return this.resetForm.get('newPassword')
  }

  get confirmNewPassword() {
    return this.resetForm.get('confirmNewPassword')
  }

  ngOnInit(): void {
    const resetToken = this.route.snapshot.queryParamMap.get('token')?.toString() ?? '';
    this.token = resetToken;
  }

  onSubmit() {
    if (this.resetForm.invalid) return;
  
    this.errorMessage = '';
    
    const resetValues: ResetPasswordInterface = {
      ...this.resetForm.value,
      token: this.token ?? '' // Make sure the token is included in the payload
    };

    this.authService.resetPassword(resetValues).subscribe({
      next: (res) => {
        this.router.navigate(['/auth/login'], { queryParams: { resetToken: resetValues.token, newPassword: resetValues.newPassword, confirmNewPassword: resetValues.confirmNewPassword } });
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
      complete: () => {
        console.log('Password reset successful');
      }
    }
    );
  }

}
