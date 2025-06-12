import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserInterface } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { AnimalService } from '../../../core/services/animal.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { MatDialog } from '@angular/material/dialog';
import { EventListComponent } from '../schedules/dialog/event-list/event-list.component';
import { EventClickArg } from '@fullcalendar/core/index.js';

@Component({
  selector: 'app-control-panel',
  imports: [CommonModule, TranslateModule, MatIconModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
})
export class ControlPanelComponent implements OnInit {
  public userInfo: UserInterface = {} as UserInterface;
  public totalClients: number = 0;
  public totalEmployees: number = 0;
  public totalAnimals: number = 0;
  public recentPendingReservations: any[] = [];
  public todaysReservations: any[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly animalService: AnimalService,
    private readonly reservationService: ReservationService,
    private dialog: MatDialog
  ) {}

  private fetchRecentPendingReservations(): void {
    this.reservationService
      .getAllReservations()
      .subscribe((reservations: any[]) => {
        // Filtra por pendentes e ordena por data decrescente
        this.recentPendingReservations = reservations
          .filter((res) => res.status === 'pending')
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5); // Pega só as 5 mais recentes
      });
  }

  private fetchTodaysReservations(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.reservationService
      .getAllReservations()
      .subscribe((reservations: any[]) => {
        this.todaysReservations = reservations
          .filter((res) => {
            const resDate = new Date(res.date);
            // Compara apenas a data, sem alterar a hora original
            return (
              resDate.getFullYear() === today.getFullYear() &&
              resDate.getMonth() === today.getMonth() &&
              resDate.getDate() === today.getDate()
            );
          })
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        console.log('hoje', this.todaysReservations);
      });
  }

  ngOnInit() {
    this.userService.getUserProfile().subscribe((res: UserInterface) => {
      this.userInfo = res;
    });

    // Buscar todos os clientes e contar
    this.userService.getAllClients().subscribe((clients: any[]) => {
      this.totalClients = clients.length;
    });

    // Buscar todos os funcionários e contar
    this.userService.getAllEmployees().subscribe((employees: any[]) => {
      this.totalEmployees = employees.length;
    });

    // Buscar todos os animais e contar
    this.animalService.getAllAnimals().subscribe((animals: any[]) => {
      this.totalAnimals = animals.length;
    });

    // Buscar últimas consultas pendentes
    this.fetchRecentPendingReservations();

    // vai buscar reservas de hoje
    this.fetchTodaysReservations();
  }

  public openDetailsReserva(reserva: any) {
    this.dialog.open(EventListComponent, {
      data: { reserva }, 
      width: '600px'
    });
  }

  toggleCalendar() {
    console.log('calendar');
  }
}
