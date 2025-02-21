import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserInterface } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true
})
export class ProfileComponent implements OnInit {
  public userInfo!: UserInterface

  constructor(
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserProfile()
      .subscribe((res: UserInterface) => {
        console.log(res)
        this.userInfo = res;
      })
  }
}
