import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FichaTrabajadorComponent } from './RRHH/ficha-trabajador/ficha-trabajador';
import { DashboardHomeComponent } from './dashboard/components/home/home.component';

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'ficha-trabajador', component: FichaTrabajadorComponent
    },

    //DASHBOARD
    { path: 'dashboard', component: DashboardHomeComponent}
];
