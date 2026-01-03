import { Routes } from "@angular/router";
import { ConfigEquiposComponent } from "./equipos.component";

export const   EQUIPOS_ROUTES: Routes = [
    {
        path: '',
        component: ConfigEquiposComponent,
        children: [
            /*
            {
                path: 'main', component: ConfigMainComponent
            },*/
        ]
    }
]