import { Routes } from "@angular/router";
import { ConfigExplosivosComponent } from "./explosivos.component";
import { CreateExplosivoComponent } from "./create/create.component";

export const EXPLOSIVOS_ROUTES: Routes = [
    {
        path: '',
        component: ConfigExplosivosComponent,
        children: [
            //CREATE
            {
                path: 'create', component: CreateExplosivoComponent
            },
        ]
    }
]