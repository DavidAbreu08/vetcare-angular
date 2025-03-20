import { Component, OnInit } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SideNavToggle } from './shared/header/sideNavToggle.interface';
import { BodyComponent } from './shared/body/body.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
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
  constructor(
    private readonly router: Router,
    ){}

  onToggleSideNav(data: SideNavToggle): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  

  ngOnInit(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const authPages = [
        '/auth/login',
        '/auth/register',
        '/auth/recover-pass',
        '/auth/verify-email',
        '/home',
        '/user'
      ];
      this.isAuthPage = authPages.includes(event.url);
      if (event.url === '/auth/login' && this.isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });
  }
}
