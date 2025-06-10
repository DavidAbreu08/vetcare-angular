import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from '../../core/services/user.service';

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
export class SidebarComponent implements OnInit {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<any>();

  public userRole: string | null = null;
  public menuItems: MenuItem[] = [];

  private readonly adminMenuItems: MenuItem[] = [
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
      label: 'Clientes',
      isOpen: true,
      children: [
        { icon: 'person', label: 'Lista de Clientes', link: '/admin/clients-list' },
        { icon: 'pets', label: 'Lista de Animais', link: '/admin/animals-list' },
      ]
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

  private readonly clientMenuItems: MenuItem[] = [
    {
      icon: 'settings',
      label: 'Meu Perfil',
      link: '/user'
    },
    {
      icon: 'event',
      label: 'Marcação de Consultas',
      link: '/client/appointments'
    },
    {
      icon: 'event',
      label: 'Minhas Consultas',
      link: '/client/history'
    },
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(user => {
      this.userRole = user.role;
      this.menuItems = this.userRole === '99' ? this.clientMenuItems : this.adminMenuItems;
    });
  }

  public toggleSidebar() {
    this.sidebarToggle.emit();
  }

  public toggleMenuItem(item: MenuItem) {
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }

  public onLogout() {
    const confirmLogout = window.confirm('Tem a certeza que deseja sair?');
    if (confirmLogout) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
