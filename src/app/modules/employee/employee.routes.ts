import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadComponent: () => import('./control-panel/control-panel.component').then(component => component.ControlPanelComponent), pathMatch: 'full' },
    
];