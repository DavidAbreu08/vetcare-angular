import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-body',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent implements OnInit {
  
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  currentRoute: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.screenWidth) {
      if (isPlatformBrowser(this.platformId)) {
        this.screenWidth = window.innerWidth;
      }
    }

    // Obtém a rota ativa
    this.currentRoute = this.router.url;

    // Escuta mudanças de rota
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  getBodyClass(): string {
    let styleClass = '';

    // Aplica estilos APENAS para rotas que começam com "/admin"
    if (this.currentRoute.startsWith('/admin')) {
      styleClass = 'body-md-screen';
      
      if (this.collapsed && this.screenWidth > 768) {
        styleClass = 'body-trimmed';
      } else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
        styleClass = 'body-md-screen';
      }
    }

    return styleClass;
  }
}
