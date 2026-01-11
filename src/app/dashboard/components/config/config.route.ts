import { Routes } from "@angular/router";
import { ConfigComponent } from "./config.component";
import { ConfigHomeComponent } from "./home/home.component";
import { EXPLOSIVOS_ROUTES } from "./components/explosivos/explosivos.route";
import { EQUIPOS_ROUTES } from "./components/equipos/equipos.route";
import { MATERIALES_ROUTES } from "./components/materials/materiales.route";

export const CONFIG_ROUTES: Routes = [
    {
        path: '',
        component: ConfigComponent,
        children: [
            //DEFAULT ROUTE
            {
                path: '', redirectTo: 'home', pathMatch: 'full'
            },
            //MAIN
            {
                path: 'home', component: ConfigHomeComponent
            },
            //EXPLOSIVOS
            {
                path: 'explosivos', children: EXPLOSIVOS_ROUTES
            },
            //EQUIPOS
            {
                path: 'equipos', children: EQUIPOS_ROUTES
            },
            //MATERIALES
            {
                path: 'materiales', children: MATERIALES_ROUTES
            },
        ]
    }
]