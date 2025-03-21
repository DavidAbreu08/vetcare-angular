import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  public showNotifications = false;
  public showProfileDropdown = false;
  public notifications = [
    {
      message:
        'O seu pedido de consulta para o dia 18/04 foi confirmado com sucesso.',
      link: '/',
    },
    {
      message:
        'O seu pedido de consulta para o dia 18/04 foi confirmado com sucesso.',
      link: '/',
    },
  ];

  /**
   * Constructor that injects ElementRef to detect clicks outside the component.
   *
   * @param elementRef Reference to the component's DOM element.
   */
  constructor(private readonly elementRef: ElementRef) {}

  /**
   * Toggles the display of the notifications dropdown.
   * If activated, ensures the profile menu is closed.
   */
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;

    if (this.showNotifications) {
      this.showProfileDropdown = false;
    }
  }

  /**
   * Toggles the display of the user profile dropdown.
   * If activated, ensures the notifications menu is closed.
   */
  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;

    if (this.showProfileDropdown) {
      this.showNotifications = false;
    }
  }

  /**
   * Closes dropdowns when the user clicks outside the component.
   * @param event Click event captured on the document.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showNotifications = false;
      this.showProfileDropdown = false;
    }
  }
}
