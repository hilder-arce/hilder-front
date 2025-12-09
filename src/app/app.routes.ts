import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FichaTrabajadorComponent } from './RRHH/ficha-trabajador/ficha-trabajador';

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'ficha-trabajador', component: FichaTrabajadorComponent
    }
];
