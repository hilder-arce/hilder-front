import { Routes } from "@angular/router";
import { CreateMaterialComponent } from "./create/create.component";
import { ListMaterialComponent } from "./list/list.component";
import { ReportsMaterialesComponent } from "./materiales.component";

export const MATERIALES_ROUTES: Routes = [
    {
        path: '',
        component: ReportsMaterialesComponent,
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