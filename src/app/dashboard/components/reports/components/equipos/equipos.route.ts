import { Routes } from "@angular/router";
import { CreateEquipoComponent } from "./create/create.component";
import { ListEquiposComponent } from "./list/list.component";
import { ReportsEquiposComponent } from "./equipos.component";

export const   EQUIPOS_ROUTES: Routes = [
    {
        path: '',
        component: ReportsEquiposComponent,
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
            },
        ]
    }
]