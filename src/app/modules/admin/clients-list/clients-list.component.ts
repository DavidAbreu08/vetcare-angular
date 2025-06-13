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
import { AnimalService } from '../../../core/services/animal.service';
import { AnimalDetailsComponent } from '../../user/profile/dialog/animal-details/animal-details.component';
import { EditClientComponent } from './dialog/edit-client/edit-client.component';
import { NotificationService } from '../../../core/services/notification.service';
import { AddAnimalComponent } from '../../user/profile/dialog/add-animal/add-animal.component';
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
    MatMenuModule,
  ],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss',
})
export class ClientsListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns: string[] = [
    'position',
    'name',
    'email',
    'nif',
    'phone',
    'createdAt',
    'animals',
    'options',
  ];
  public clients = new MatTableDataSource<any>();

  public currentRow: any;

  public readonly dialog = inject(MatDialog);

  public openedOptionsIndex: number | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly animalService: AnimalService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userService.getAllClients().subscribe({
      next: (data) => {
        const requests = data.map((client: any) =>
          this.animalService
            .getAnimalsByClient(client.id)
            .toPromise()
            .then((animals: any[] | undefined) => {
              client.animals = animals ?? []; // Garante que é sempre array
              return client;
            })
        );
        Promise.all(requests).then((clientsWithAnimals) => {
          this.clients.data = clientsWithAnimals;
        });
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      },
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(AddClientsComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Atualiza a lista de clientes
        this.userService.getAllClients().subscribe({
          next: (data) => {
            const requests = data.map((client: any) =>
              this.animalService
                .getAnimalsByClient(client.id)
                .toPromise()
                .then((animals: any[] | undefined) => {
                  client.animals = animals ?? [];
                  return client;
                })
            );
            Promise.all(requests).then((clientsWithAnimals) => {
              this.clients.data = clientsWithAnimals;
            });
          },
          error: (error) => {
            console.error('Error fetching clients:', error);
          },
        });
      }
    });
  }

  public openEditDialog(client: any): void {
    const dialogRef = this.dialog.open(EditClientComponent, {
      width: '900px',
      data: client,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.getAllClients().subscribe({
          next: (data) => {
            const requests = data.map((client: any) =>
              this.animalService
                .getAnimalsByClient(client.id)
                .toPromise()
                .then((animals: any[] | undefined) => {
                  client.animals = animals ?? [];
                  return client;
                })
            );
            Promise.all(requests).then((clientsWithAnimals) => {
              this.clients.data = clientsWithAnimals;
            });
          },
          error: (error) => {
            console.error('Error fetching clients:', error);
          },
        });
      }
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.clients.filter = filterValue.trim().toLowerCase();
  }

  public filterByAnimal(animalName: string) {
    const filterValue = animalName.trim().toLowerCase();
    this.clients.filterPredicate = (data: any, filter: string) => {
      return (
        Array.isArray(data.animals) &&
        data.animals.some((animal: any) =>
          (animal.name || '').toLowerCase().includes(filter)
        )
      );
    };
    this.clients.filter = filterValue;
  }

  public filterByAnimalEvent(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterByAnimal(value);
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

  public openAnimalDialog(animal: any): void {
    this.dialog.open(AnimalDetailsComponent, {
      width: '600px',
      data: { animal },
    });
  }

  public deleteClient(client: any): void {
    if (!confirm('Tem certeza que deseja remover este cliente?')) {
      return;
    }
    this.userService.deleteUser(client.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cliente removido com sucesso!');
        this.userService.getAllClients().subscribe({
          next: (data) => {
            const requests = data.map((client: any) =>
              this.animalService
                .getAnimalsByClient(client.id)
                .toPromise()
                .then((animals: any[] | undefined) => {
                  client.animals = animals ?? [];
                  return client;
                })
            );
            Promise.all(requests).then((clientsWithAnimals) => {
              this.clients.data = clientsWithAnimals;
            });
          },
          error: (error) => {
            console.error('Error fetching clients:', error);
          },
        });
      },
      error: (error) => {
        console.error('Erro ao remover cliente:', error);
      },
    });
  }

  public addAnimalClient(client: any){
    this.dialog.open(AddAnimalComponent, {
      width: '600px',
      data: { id: client.id },
    });
    this.dialog.afterAllClosed.subscribe(() => {
      // Atualiza a lista de clientes após adicionar um animal
      this.userService.getAllClients().subscribe({
        next: (data) => {
          const requests = data.map((client: any) =>
            this.animalService
              .getAnimalsByClient(client.id)
              .toPromise()
              .then((animals: any[] | undefined) => {
                client.animals = animals ?? [];
                return client;
              })
          );
          Promise.all(requests).then((clientsWithAnimals) => {
            this.clients.data = clientsWithAnimals;
          });
        },
        error: (error) => {
          console.error('Error fetching clients:', error);
        },
      });
    });
  }
}
