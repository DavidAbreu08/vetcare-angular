import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import { ListComponent } from './list/list.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';


@Component({
  selector: 'app-employees-list',
  imports: [
    TranslateModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatMenuModule,
    ListComponent,
    AddEmployeeComponent
  ],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss',
  standalone: true
})
export class EmployeesListComponent implements OnInit {

  public showForm: boolean = false;
  public employees: any[] = [];

  constructor(
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

  toggleView() {
    this.showForm = !this.showForm;
  }

}
