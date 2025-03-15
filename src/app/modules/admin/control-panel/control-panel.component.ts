import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserInterface } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-control-panel',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss'
})
export class ControlPanelComponent implements OnInit{

  public userInfo!: UserInterface;
  public showNotifications = false;
  public notifications = [
    { 
      message: "O seu pedido de consulta para o dia 18/04 foi confirmado com sucesso.",
      link: "/",
    },
    { 
      message: "O seu pedido de consulta para o dia 18/04 foi confirmado com sucesso.",
      link: "/",
    }
  ];

  constructor(
    private readonly userService: UserService
  ){}

  ngOnInit() {
    this.userService.getUserProfile()
      .subscribe((res: UserInterface) => {
        console.log(res)
        this.userInfo = res;
      })
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

}
