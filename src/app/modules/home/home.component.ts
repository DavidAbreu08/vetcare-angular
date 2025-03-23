import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent{
  
  userProfile: any;

  constructor(
    private readonly router: Router,
  ) {}


  onNavigation(){
    this.router.navigate(['auth/login']);
  }
}
