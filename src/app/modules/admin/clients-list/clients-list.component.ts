import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../core/services/user.service';
import { AddClientsComponent } from './dialog/add-clients/add-clients.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-clients-list',
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
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns: string[] = ['position', 'name', 'email', 'nif', 'phone', 'createdAt', 'options'];
  public clients = new MatTableDataSource<any>();

  public currentRow: any;

  public readonly dialog = inject(MatDialog);

  public openedOptionsIndex: number | null = null;

  constructor(
    private readonly userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getAllClients().subscribe({
      next: (data) => {
        this.clients.data = data;
      },
      error: (error) => {
        console.error("Error fetching clients:", error);
      }
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(AddClientsComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.clients.filter = filterValue.trim().toLowerCase();
  }

  public openOptionsMenu(index: number, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.openedOptionsIndex = this.openedOptionsIndex === index ? null : index;
  }
  
  public closeOptionsMenu() {
    this.openedOptionsIndex = null;
  }
}
