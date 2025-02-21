import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private router: Router
  ){}

  canActivate(): boolean{
    if(this.userService.userInfo === 97){
      return true;
    }else{
      this.router.navigate(['/home'])
      return false;
    }
  }
};
