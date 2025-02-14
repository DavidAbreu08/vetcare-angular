import { Component, OnInit } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit{
  public isAuthPage!: boolean
  public isLoggedIn!: boolean

  constructor(
  private readonly router: Router,
  ){

  }

  ngOnInit(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (
        event.url === '/auth/login'||
        event.url === '/auth/signup'||
        event.url === '/auth/recover-pass' ||
        event.url === '/auth/verify-email' 
      ) {
        this.isAuthPage = true;
      } else {
        this.isAuthPage = false;
      }

      if (event.url === '/auth/login' && this.isLoggedIn) {
        this.router.navigate(['/home'])
      }
    });
  }
}
