/*
 * File: header.component.ts
 * Project: VetCare
 * Created: Friday, 14th March 2025 2:05:49 pm
 * Last Modified: Friday, 21st March 2025 4:07:07 pm
 * Copyright © 2025 VetCare
 */

import { Component, EventEmitter, HostListener, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { navbarData } from './nav-data';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SideNavToggle } from './sideNavToggle.interface';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent implements OnInit{
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter()
  collapsed = false;
  screenWidth = 0;

  navData = navbarData;
  activeRoute: string = '';

  constructor(
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
    }
    if (this.screenWidth <= 768) {
      this.collapsed = false;
    }
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
    }
    this.activeRoute = this.router.url;

    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  getIcon(routeLink: string): string {
    return this.activeRoute === `/${routeLink}`
      ? this.navData.find(item => item.routeLink === routeLink)?.iconActive || ''
      : this.navData.find(item => item.routeLink === routeLink)?.iconInactive || '';
  }

  toggleCollapse(): void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

}
