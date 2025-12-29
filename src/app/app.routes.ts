import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DASHBOARD_ROUTES } from './dashboard/dashboard.routes';

export const routes: Routes = [
    //PUBLIC
    {
        path: 'login', component: LoginComponent
    },

    //DASHBOARD
    {
        path: 'dashboard', children: DASHBOARD_ROUTES
    }
];
