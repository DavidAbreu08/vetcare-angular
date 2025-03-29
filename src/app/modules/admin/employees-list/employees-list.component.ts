
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employees-list',
  imports: [
    TranslateModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss',
  standalone: true
})
export class EmployeesListComponent implements OnInit {
  public openedOptionsIndex: string = '';

  employees: any[] = [];

  constructor(
    private readonly elementRef: ElementRef,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.error("Error fetching employees:", error);
      }
    });
  }

  public openOptionsMenu(index: number): void {
    if (this.openedOptionsIndex === index.toString()) {
      this.openedOptionsIndex = '';
      return;
    }
    
    this.openedOptionsIndex = index.toString();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.openedOptionsIndex = '';
    }
  }
}
