import { Routes } from "@angular/router";
import { ConfigEquiposComponent } from "./equipos.component";
import { CreateEquipoComponent } from "./create/create.component";
import { ListEquiposComponent } from "./list/list.component";

export const   EQUIPOS_ROUTES: Routes = [
    {
        path: '',
        component: ConfigEquiposComponent,
        children: [
            //CREATE
            {
                path: 'create', component: CreateEquipoComponent
            },
            {
                path: 'list', component: ListEquiposComponent
            },
            {
                path: '', redirectTo: 'list', pathMatch: 'full'
            }
        ]
    }
]