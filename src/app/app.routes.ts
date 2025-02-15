import { Routes } from '@angular/router';

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
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.routes').then(route => route.routes)
    }
];
