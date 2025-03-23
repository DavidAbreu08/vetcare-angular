/*
 * File: app.component.ts
 * Project: VetCare
 * Created: Friday, 14th March 2025 2:05:49 pm
 * Last Modified: Friday, 21st March 2025 4:01:40 pm
 * Copyright © 2025 VetCare
 */
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { MatIconModule } from '@angular/material/icon';
import { TopBarComponent } from "./shared/top-bar/top-bar.component";

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FooterComponent,
    RouterOutlet,
    SidebarComponent,
    MatIconModule,
    TopBarComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit {
  public isAuthPage!: boolean;
  public isLoggedIn!: boolean;
  public isSideNavCollapsed = false;
  public screenWidth = 0;
  public sizeClass: string = 'screen-md-screen';
  public currentRoute: string = '';
  public isSidebarCollapsed = false;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {
    this.translate.addLangs(['en', 'pt']);
    this.translate.setDefaultLang('pt');
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      this.checkIfAuthPage(this.currentRoute);
      
      if (event.url === '/auth/login' && this.isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });
  }

  /** Método para verificar se a página atual é uma página de autenticação */
  private checkIfAuthPage(url: string): void {
    const authPages = [
      '/auth/login',
      '/auth/register',
      '/auth/recover-pass',
      '/auth/verify-email',
      '/home'
    ];
    this.isAuthPage = authPages.includes(url);
  }

  public onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
