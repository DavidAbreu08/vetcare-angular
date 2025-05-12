import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../modules/auth/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
  link?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatIconModule, TranslateModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true,
})
export class SidebarComponent {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<any>();

  menuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      isOpen: false,
      link: '/admin/dashboard'
    },
    {
      icon: 'monitor_heart',
      label: 'Clinica',
      isOpen: true,
      children: [
        { icon: 'schedule', label: 'Horários', link: '/admin/schedule' },
        { icon: 'badge', label: 'Funcionários', link: '/admin/employees-list'},
        { icon: 'event', label: 'Agenda', link: '/admin/agenda' },
      ]
    },
    {
      icon: 'group',
      label: 'Clientes'
    },
    {
      icon: 'description',
      label: 'Validação',
      link: '/admin/validation'
    },
    {
      icon: 'mark_chat_unread',
      label: 'Notificações'
    },
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: MenuItem) {
    // Only toggle if sidebar is not collapsed and item has children
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }

  onLogout() {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
