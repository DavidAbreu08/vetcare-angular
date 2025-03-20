import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-body',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent implements OnInit {
  
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  @Input() isAuthPage = false;
  @Input() isLoggedIn = false;  
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

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  getBodyClass(): string {
    if (this.isAuthPage) {
        return 'body-full-width';
    }

    if (this.collapsed && this.screenWidth > 768) {
        return 'body-trimmed';
    } else if (this.collapsed && this.screenWidth <= 768) {
        return 'body-md-screen';
    }

    return 'body-md-screen';
}

}
