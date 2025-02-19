import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent implements OnInit{
  
  userProfile: any;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(){
    //this.authService.getUserProfile().subscribe(
      //(profile) => {
        //this.userProfile = profile
        //console.log(this.userProfile)
      //},
      //(error) => {
        //console.error('Erro ao buscar o perfil', error);
      //}
    //)
  }

  onNavigation(){
    this.router.navigate(['auth/login']);
  }
}
