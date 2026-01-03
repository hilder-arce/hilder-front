import { Routes } from "@angular/router";
import { ConfigMaterialesComponent } from "./materiales.component";

export const MATERIALES_ROUTES: Routes = [
    {
        path: '',
        component: ConfigMaterialesComponent,
        children: [
            /*
            {
                path: 'main', component: ConfigMainComponent
            },*/
        ]
    }
]