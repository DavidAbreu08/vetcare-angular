import { Component } from '@angular/core';
import { TopBarComponent } from '../../../shared/top-bar/top-bar.component';

@Component({
  selector: 'app-employees-list',
  imports: [
    TopBarComponent
  ],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss'
})
export class EmployeesListComponent {

}
