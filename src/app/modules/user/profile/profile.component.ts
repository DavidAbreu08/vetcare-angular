import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserInterface } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../../core/services/notification.service';

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

  public defaultAvatar = '../../../../assets/icons/user-avatar.png';
  public selectedImage: string | ArrayBuffer | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly fb: FormBuilder,
    private readonly notificationService: NotificationService,
  ) {}

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
        this.userInfo = res;
        this.userForm.patchValue(res);
      })
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
      next: () => {
        this.notificationService.showSuccess('Perfil atualizado com sucesso!');
        this.userInfo = { ...this.userInfo, ...updatedUser };
      },
      error: (err) => {
        this.notificationService.showError('Erro ao atualizar perfil. Tente novamente.');
        console.error(err);
      }
    });
  }
}
