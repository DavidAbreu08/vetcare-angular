import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';


export interface PeriodicElement {
  position: number;
  firstName: string;
  nif: number;
  email: string;
  phone: string;
  function: string;
  createdAt: string;
  isActive: string;
  options: boolean;
}


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
    MatMenuModule
  ],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss',
  standalone: true
})
export class EmployeesListComponent implements OnInit {

  public displayedColumns: string[] = ['position', 'firstName', 'email', 'nif', 'phone', 'function', 'createdAt', 'isActive', 'options'];
  public dataSource = new MatTableDataSource<any>();

  public openedOptionsIndex: string = '';
  public currentRow: any;


  constructor(
    private readonly elementRef: ElementRef,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getAllEmployees().subscribe({
      next: (data) => {
        console.log(data);
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error("Error fetching employees:", error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  setCurrentRow(row: any) {
    this.currentRow = row;
  }

  onEdit(row: any) {
    console.log('Edit:', row);
  }

  onChangePermissions(row: any) {
    console.log('Change permissions:', row);
  }

  onDelete(row: any) {
    console.log('Delete:', row);
  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.openedOptionsIndex = '';
    }
  }
}
