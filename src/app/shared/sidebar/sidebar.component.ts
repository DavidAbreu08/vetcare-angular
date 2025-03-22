import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
      isOpen: false,
      children: [
        { icon: 'schedule', label: 'Horários', link: '/admin/clinic/schedule' },
        { icon: 'badge', label: 'Funcionários' },
        { icon: 'event', label: 'Agenda' },
      ]
    },
    {
      icon: 'group',
      label: 'Clientes',
      link: '/admin/employees-list'
    },
    {
      icon: 'description',
      label: 'Validação'
    },
    {
      icon: 'mark_chat_unread',
      label: 'Notificações'
    },
  ];

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: MenuItem) {
    // Only toggle if sidebar is not collapsed and item has children
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }
}
