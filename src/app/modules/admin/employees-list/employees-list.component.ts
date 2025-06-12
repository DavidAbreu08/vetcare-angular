import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from './dialog/add-employee/add-employee.component';
import { EditEmployeeComponent } from './dialog/edit-employee/edit-employee.component';
import { NotificationService } from '../../../core/services/notification.service';

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
  ],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EmployeesListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns: string[] = [
    'position',
    'name',
    'email',
    'nif',
    'phone',
    'function',
    'createdAt',
    'isActive',
    'options',
  ];
  public employees = new MatTableDataSource<any>();

  public currentRow: any;

  public readonly dialog = inject(MatDialog);

  public openedOptionsIndex: number | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees.data = data;
        console.log('Employees fetched successfully:', this.employees.data);
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      },
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.getAllEmployees().subscribe({
          next: (data) => {
            this.employees.data = data;
          },
          error: (error) => {
            console.error('Erro ao atualizar lista de funcionários:', error);
          },
        });
      }
    });
  }

  public openDialogEdit(employee: any): void {
    const dialogRef = this.dialog.open(EditEmployeeComponent, {
      width: '900px',
      data: employee,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.employees.filter = filterValue.trim().toLowerCase();
  }

  public openOptionsMenu(index: number, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.openedOptionsIndex = this.openedOptionsIndex === index ? null : index;
  }

  public onDelete(employee: any) {
    if (confirm(`Tem a certeza que quer apagar ${employee.name}?`)) {
      this.userService.deleteUser(employee.id).subscribe({
        next: () => {
          this.employees.data = this.employees.data.filter(
            (emp: any) => emp.id !== employee.id
          );
          this.closeOptionsMenu();
          this.currentRow = null;
          this.openedOptionsIndex = null;
          this.notificationService.showSuccess(
            `Funcionário ${employee.name} apagado com sucesso.`
          );
        },
        error: () => {
          this.notificationService.showError('Erro ao apagar funcionário');
        },
      });
    }
  }

  public closeOptionsMenu() {
    this.openedOptionsIndex = null;
  }
}
