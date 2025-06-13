import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-agenda',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent implements OnInit {
  public isLoading = true;
  public employees: any[] = [];
  public filteredEmployees: any[] = [];
  public showEmployeeList = false;
  public selectedEmployee: any = null;
  public selectedEmployeeReservations: any[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.userService.getAllEmployees().subscribe((employees: any[]) => {
      this.employees = employees;
      this.filteredEmployees = employees;
      this.isLoading = false;
    });
  }

  public searchEmployeeByName(name: string): void {
    const filterValue = name.trim().toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      (emp.name ?? '').toLowerCase().includes(filterValue)
    );
  }

  public onEmployeeSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchEmployeeByName(value);
  }

  public onEmployeeFocus() {
    this.showEmployeeList = true;
  }

  public onEmployeeBlur() {
    // Pequeno delay para permitir clique na lista antes de esconder
    setTimeout(() => this.showEmployeeList = false, 150);
  }

  public selectEmployee(emp: any) {
    this.selectedEmployee = emp;
    this.showEmployeeList = false;
    this.fetchEmployeeReservationsForToday(emp);
  }

  private fetchEmployeeReservationsForToday(emp: any) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    // Usa o parâmetro emp.id e não selectedEmployee.id
    this.reservationService.getReservations(emp.id, dateStr).subscribe((res: any[]) => {
      this.selectedEmployeeReservations = res;
      console.log(this.selectedEmployeeReservations);
    });
  }
}
