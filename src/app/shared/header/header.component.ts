import { Component, EventEmitter, HostListener, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { navbarData } from './nav-data';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideNavToggle } from './sideNavToggle.interface';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule,
    RouterModule
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


  constructor(private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
    }
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
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
