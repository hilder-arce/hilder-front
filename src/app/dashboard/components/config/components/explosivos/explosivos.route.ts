import { Routes } from "@angular/router";
import { ConfigExplosivosComponent } from "./explosivos.component";
import { CreateExplosivoComponent } from "./create/create.component";
import { ExplosivosListComponent } from "./list/list.component";

export const EXPLOSIVOS_ROUTES: Routes = [
    {
        path: '',
        component: ConfigExplosivosComponent,
        children: [
            //DEFAULT ROUTE
            {
                path: '', redirectTo: 'list', pathMatch: 'full'
            },
            //CREATE
            {
                path: 'create', component: CreateExplosivoComponent
            },
            //LIST
            {
                path: 'list', component: ExplosivosListComponent
            }
        ]
    }
]