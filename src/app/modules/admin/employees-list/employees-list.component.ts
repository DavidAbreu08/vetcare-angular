import { Component, OnInit } from '@angular/core';
import { TopBarComponent } from '../../../shared/top-bar/top-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employees-list',
  imports: [
    TopBarComponent,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss',
  standalone: true
})
export class EmployeesListComponent implements OnInit {

  employees: any[] = [];

  constructor(private readonly userService: UserService) { }

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
}
