import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../modules/auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(
    private readonly authService: AuthService,
    private route: Router,
  ){}

  canActivate(): boolean {
    if(this.authService.isLoggedIn()){
      return true;
    }else{
      this.route.navigate(['auth/login']);
      return false;
    }
  }

}