import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-pass',
  imports: [],
  templateUrl: './recover-pass.component.html',
  styleUrl: './recover-pass.component.scss'
})
export class RecoverPassComponent {
  constructor(private router: Router){

  }

  handleEmail() {
    this.router.navigate(['auth/verify-email']);
  }
}
