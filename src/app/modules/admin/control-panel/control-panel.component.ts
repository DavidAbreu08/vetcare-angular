import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserInterface } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../../shared/top-bar/top-bar.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-control-panel',
  imports: [
    CommonModule,
    TopBarComponent,
    TranslateModule,
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
        this.userInfo = res;
      })
  }

  toggleCalendar(){
    console.log('calendar')
  }
}
