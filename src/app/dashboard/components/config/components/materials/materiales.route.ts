import { Routes } from "@angular/router";
import { ConfigMaterialesComponent } from "./materiales.component";
import { CreateMaterialComponent } from "./create/create.component";

export const MATERIALES_ROUTES: Routes = [
    {
        path: '',
        component: ConfigMaterialesComponent,
        children: [
            //CREATE 
            {
                path: 'create', component: CreateMaterialComponent
            },
        ]
    }
]