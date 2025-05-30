import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { Observable, switchMap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleAdminGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ){}

  canActivate(): Observable<boolean> {
    return this.userService.getUserProfile().pipe(
      switchMap(() => {
        const role = this.userService.getRole();
        if (role === '97') {
          return [true];  // Allow navigation
        } else {
          this.router.navigate(['/home']); // Redirect unauthorized users
          return [false] 
        }
      })
    );
  }
}