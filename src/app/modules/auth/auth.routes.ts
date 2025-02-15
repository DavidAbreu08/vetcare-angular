import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { RecoverPassComponent } from "./recover-pass/recover-pass.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recover-pass', component: RecoverPassComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
];
