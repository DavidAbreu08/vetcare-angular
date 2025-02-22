import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserInterface } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-control-panel',
  imports: [],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss'
})
export class ControlPanelComponent implements OnInit{

  public userInfo!: UserInterface

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
}
