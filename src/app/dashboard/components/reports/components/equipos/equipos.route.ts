import { Routes } from "@angular/router";
import { CreateEquipoComponent } from "./create/create.component";
import { ListEquiposComponent } from "./list/list.component";
import { ReportsEquiposComponent } from "./equipos.component";

export const   EQUIPOS_ROUTES: Routes = [
    {
        path: '',
        component: ReportsEquiposComponent,
        children: [
            //LIST
            {
                path: 'list', component: ListEquiposComponent
            },

            //FOR DEFAULT
            {
                path: '', redirectTo: 'list', pathMatch: 'full'
            },
        ]
    }
]