import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadComponent: () => import('./control-panel/control-panel.component').then(component => component.ControlPanelComponent) },
    { path: 'schedule', loadComponent: () => import('./schedules/schedules.component').then(component => component.SchedulesComponent)},
    { path: 'employees-list', loadComponent: () => import('./employees-list/employees-list.component').then(component => component.EmployeesListComponent) },
    { path: 'agenda', loadComponent: () => import('./agenda/agenda.component').then(component => component.AgendaComponent) },
    { path: 'validation', loadComponent: () => import('./validation/validation.component').then(component => component.ValidationComponent) },
    { path: 'clients-list', loadComponent: () => import('./clients-list/clients-list.component').then(component => component.ClientsListComponent) },
    { path: '**', redirectTo: 'dashboard' },
];
