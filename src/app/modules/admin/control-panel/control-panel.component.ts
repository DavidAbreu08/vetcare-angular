import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserInterface } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-control-panel',
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
  ],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss'
})
export class ControlPanelComponent implements OnInit{
  public userInfo: UserInterface = {} as UserInterface;
  
  constructor(
    private readonly userService: UserService,
  ){}

  ngOnInit() {
    this.userService.getUserProfile()
      .subscribe((res: UserInterface) => {
        console.log(res)
        this.userInfo = res;
      })
  }

  toggleCalendar(){
    console.log('calendar')
  }
}
