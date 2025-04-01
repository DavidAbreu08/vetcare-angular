import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnChanges {

  @Input() dataSource: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns: string[] = ['position', 'firstName', 'email', 'nif', 'phone', 'function', 'createdAt', 'isActive', 'options'];
  public tableDataSource = new MatTableDataSource<any>();

  public openedOptionsIndex: string = '';
  public currentRow: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']) {
      this.tableDataSource.data = this.dataSource;
    }
    if (this.paginator) {
      this.tableDataSource.paginator = this.paginator;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
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

}
