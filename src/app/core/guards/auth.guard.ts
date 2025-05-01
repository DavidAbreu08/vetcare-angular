import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../modules/auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(
    private readonly authService: AuthService,
    private readonly route: Router,
  ){}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
      if (!isLoggedIn) {
        this.route.navigate(['/auth/login']);
      }
      return isLoggedIn;
    }

}