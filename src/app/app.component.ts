import { Component, OnInit } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from './core/services/user.service';
import { SideNavToggle } from './shared/header/sideNavToggle.interface';
import { BodyComponent } from './shared/body/body.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    BodyComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit{
  public isAuthPage!: boolean
  public isLoggedIn!: boolean

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  constructor(
  private readonly router: Router,
  ){}


  ngOnInit(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (
        event.url === '/auth/login'||
        event.url === '/auth/register'||
        event.url === '/auth/recover-pass' ||
        event.url === '/auth/verify-email' ||
        event.url === '/home' 

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
