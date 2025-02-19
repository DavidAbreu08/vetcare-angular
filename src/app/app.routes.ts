import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
        loadChildren: () => import('./modules/user/user.routes').then(route => route.routes)
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.routes').then(route => route.routes)
    },
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.routes').then(route => route.routes),
        canActivate: [authGuard],
    },
];
