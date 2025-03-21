/*
 * File: app.component.ts
 * Project: VetCare
 * Created: Friday, 14th March 2025 2:05:49 pm
 * Last Modified: Friday, 21st March 2025 4:01:40 pm
 * Copyright © 2025 VetCare
 */
import { Component, Inject, OnInit, PLATFORM_ID, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { filter } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SideNavToggle } from './shared/header/sideNavToggle.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
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

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {
    this.translate.addLangs(['en', 'pt']);
    this.translate.setDefaultLang('pt');
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      this.checkIfAuthPage(event.url);
      this.updateSizeClass();
      
      if (event.url === '/auth/login' && this.isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });
  }

  /** Método para verificar se a página atual é uma página de autenticação */
  private checkIfAuthPage(url: string) {
    const authPages = [
      '/auth/login',
      '/auth/register',
      '/auth/recover-pass',
      '/auth/verify-email',
      '/home'
    ];
    this.isAuthPage = authPages.includes(url);
  }

  /** Método para atualizar a classe CSS dependendo do estado da aplicação */
  private updateSizeClass() {
    if (this.isAuthPage) {
      this.sizeClass = 'screen-full-width';
    } else if (this.isSideNavCollapsed && this.screenWidth > 768) {
      this.sizeClass = 'screen-trimmed';
    } else {
      this.sizeClass = 'screen-md-screen';
    }
  }

  /** Método chamado quando o sidenav é alterado */
  public onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
    this.updateSizeClass();
  }

  /** Atualiza o `screenWidth` quando a janela é redimensionada */
  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.updateSizeClass();
  }
}
