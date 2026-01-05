import { Routes } from "@angular/router";
import { ConfigEquiposComponent } from "./equipos.component";
import { CreateEquipoComponent } from "./create/create.component";

export const   EQUIPOS_ROUTES: Routes = [
    {
        path: '',
        component: ConfigEquiposComponent,
        children: [
            //CREATE
            {
                path: 'create', component: CreateEquipoComponent
            },
        ]
    }
]