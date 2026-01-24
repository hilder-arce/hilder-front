import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DASHBOARD_ROUTES } from './dashboard/dashboard.routes';
import { HomeComponent } from './public/componets/home/home.component';
import { NosotrosComponent } from './public/componets/nosotros/nosotros.component';
import { ContactoComponent } from './public/componets/contacto/contacto.component';

export const routes: Routes = [
    //PUBLIC
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'home', component: HomeComponent
    },
    {
        path: 'nosotros', component: NosotrosComponent
    },
    {
        path: 'contacto', component: ContactoComponent
    },
    

    //DASHBOARD
    {
        path: 'dashboard', children: DASHBOARD_ROUTES
    }
];
