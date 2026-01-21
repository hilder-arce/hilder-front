import { Routes } from "@angular/router";
import { ConfigComponent } from "./config.component";
import { ConfigOverviewComponent } from "./overview/config-overview.component";
import { EXPLOSIVOS_ROUTES } from "./components/explosivos/explosivos.route";
import { EQUIPOS_ROUTES } from "./components/equipos/equipos.route";
import { MATERIALES_ROUTES } from "./components/materials/materiales.route";

export const CONFIG_ROUTES: Routes = [
    {
        path: '',
        component: ConfigComponent,
        children: [
            //DEFAULT ROUTE - OVERVIEW/DASHBOARD
            {
                path: '', component: ConfigOverviewComponent
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