import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadComponent: () => import('./control-panel/control-panel.component').then(component => component.ControlPanelComponent), pathMatch: 'full' },
    { path: 'schedule', loadComponent: () => import('./schedules/schedules.component').then(component => component.SchedulesComponent), pathMatch: 'full' },
    { path: 'employees-list', loadComponent: () => import('./employees-list/employees-list.component').then(component => component.EmployeesListComponent), pathMatch: 'full' },

    
];
