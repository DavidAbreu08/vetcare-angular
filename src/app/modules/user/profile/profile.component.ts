import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserInterface } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../../core/services/notification.service';
import { AnimalService } from '../../../core/services/animal.service';
import { PhotoDefault } from '../../../core/interfaces/photo-default';
import { MatDialog } from '@angular/material/dialog';
import { AddAnimalComponent } from './dialog/add-animal/add-animal.component';
import { AnimalDetailsComponent } from './dialog/animal-details/animal-details.component';

/**
 * Profile Component
 * 
 * @class
 * @exports
 * @implements {OnInit}
 */
@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true
})

export class ProfileComponent implements OnInit {
  public userInfo!: UserInterface
  public userForm!: FormGroup;
  public animals: any[] = [];

  
  public readonly dialog = inject(MatDialog);


  public isClient: boolean = false;

  public defaultAvatar = '../../../../assets/icons/user-avatar.png';
  public selectedImage: string | ArrayBuffer | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly fb: FormBuilder,
    private readonly notificationService: NotificationService,
    private readonly animalService: AnimalService
  ) {}

  public photoDefault: PhotoDefault = {
    dog: '../../../../assets/images/dog-default.png',
    cat: '../../../../assets/images/cat-default.png',
    rabbit: '../../../../assets/images/rabbit-default.png',
    bird: '../../../../assets/images/bird-default.png'
  };

  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      profilePicture: ['', Validators.required],
      nif: ['', Validators.required],
      phone: ['', Validators.required],
      dateBirth: ['', Validators.required],
    });

    this.userService.getUserProfile()
      .subscribe((res: UserInterface) => {
        this.isClient = res.role == 99;
        this.userInfo = res;
        this.userForm.patchValue(res);

        if (this.isClient) {
        this.animalService.getAnimalsByClient(this.userInfo.id)
          .subscribe((res: any[]) => {
            this.animals = res;
          })
        }
      })
  }

  public getAnimalPhoto(animal: any): string {
    if (animal.image && animal.image.trim() !== '') {
      return animal.image;
    }

    switch (animal.type) {
      case 'dog':
        return this.photoDefault.dog;
      case 'cat':
        return this.photoDefault.cat;
      case 'rabbit':
        return this.photoDefault.rabbit;
      case 'bird':
        return this.photoDefault.bird;
      default:
        return '../../../../assets/icons/user-avatar.png';
    }
  }

  public onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  public onAddAnimalDialog(): void {
    const dialogRef = this.dialog.open(AddAnimalComponent, {
      width: '800px',
      data: { 
        id: this.userInfo.id 
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  public onAnimalSelected(animal: any){
    const dialogRef = this.dialog.open(AnimalDetailsComponent, {
      width: '800px',
      data: { 
        name: this.userInfo.name,
        animal: animal
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  public onSubmit(): void {
    const requiredFields = ['name', 'email', 'nif', 'phone', 'dateBirth'];
    const missingFields = requiredFields.filter(field => !this.userForm.get(field)?.value);

    if (missingFields.length > 0) {
      this.notificationService.showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Envie apenas os campos permitidos pelo backend
    const allowedFields = ['name', 'nif', 'phone', 'dateBirth', 'profilePicture', 'avatarUrl'];
    const updatedUser: any = {};
    allowedFields.forEach(field => {
      if (this.userForm.get(field)) {
        updatedUser[field] = this.userForm.get(field)?.value;
      }
    });

    // Se você usa avatarUrl para a imagem:
    if (this.selectedImage) {
      updatedUser.avatarUrl = this.selectedImage;
    }

    this.userService.updateUser(this.userInfo.id, updatedUser).subscribe({
      next: (response) => {
        console.log('Backend response:', response);
        this.userInfo = { ...this.userInfo, ...updatedUser };
        this.notificationService.showSuccess('Perfil atualizado com sucesso!');
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Erro ao atualizar perfil. Tente novamente.');
      }
    });
  }
}
