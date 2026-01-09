import { Routes } from "@angular/router";
import { ConfigMaterialesComponent } from "./materiales.component";
import { CreateMaterialComponent } from "./create/create.component";
import { ListMaterialComponent } from "./list/list.component";

export const MATERIALES_ROUTES: Routes = [
    {
        path: '',
        component: ConfigMaterialesComponent,
        children: [
            //FOR DEFAULT
            {
                path: '', redirectTo: 'list', pathMatch: 'full'
            },
            //CREATE 
            {
                path: 'create', component: CreateMaterialComponent
            },
            //LIST 
            {
                path: 'list', component: ListMaterialComponent
            },
        ]
    }
]