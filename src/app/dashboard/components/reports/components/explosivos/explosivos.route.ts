import { Routes } from "@angular/router";
import { CreateExplosivoComponent } from "./create/create.component";
import { ExplosivosListComponent } from "./list/list.component";
import { ReportsExplosivosComponent } from "./explosivos.component";

export const EXPLOSIVOS_ROUTES: Routes = [
    {
        path: '',
        component: ReportsExplosivosComponent,
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