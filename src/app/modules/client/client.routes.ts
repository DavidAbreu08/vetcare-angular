import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: '', redirectTo: 'user', pathMatch: 'full' },
    { path: 'appointments', loadComponent: () => import('./appointments/appointments.component').then(component => component.AppointmentsComponent), pathMatch: 'full' },
    { path: 'history', loadComponent: () => import('./history-appointments/history-appointments.component').then(component => component.HistoryAppointmentsComponent), pathMatch: 'full' },
    
];