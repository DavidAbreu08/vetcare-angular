import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./login/login.component').then(component => component.LoginComponent)},
    { path: 'register', loadComponent: () => import('./register/register.component').then(component => component.RegisterComponent)},
    { path: 'recover-pass', loadComponent: () => import('./recover-pass/recover-pass.component').then(component => component.RecoverPassComponent)},
    { path: 'verify-email', loadComponent: () => import('./verify-email/verify-email.component').then(component => component.VerifyEmailComponent)},
    { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password.component').then(component => component.ResetPasswordComponent)},
];
