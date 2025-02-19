import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./profile/profile.component').then(component => component.ProfileComponent)
    }
]