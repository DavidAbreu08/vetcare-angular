import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleAdminGuard } from './core/guards/role-admin.guard';
import { RoleEmployeeGuard } from './core/guards/role-employee.guard';
import { RoleClientGuard } from './core/guards/role-client.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        loadComponent: () => import('./modules/home/home.component').then(component => component.HomeComponent)
    },
    {
        path: 'user',
        loadChildren: () => import('./modules/user/user.routes').then(route => route.routes),
        canActivate: [AuthGuard, RoleAdminGuard, RoleEmployeeGuard, RoleClientGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.routes').then(route => route.routes)
    },
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.routes').then(route => route.routes),
        canActivate: [AuthGuard, RoleAdminGuard],
    },
    {
        path: 'employee',
        loadChildren: () => import('./modules/employee/employee.routes').then(route => route.routes),
        canActivate: [AuthGuard, RoleEmployeeGuard],
    },
];
