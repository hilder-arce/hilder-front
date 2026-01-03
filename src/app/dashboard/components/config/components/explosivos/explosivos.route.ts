import { Routes } from "@angular/router";
import { ConfigExplosivosComponent } from "./explosivos.component";

export const EXPLOSIVOS_ROUTES: Routes = [
    {
        path: '',
        component: ConfigExplosivosComponent,
        children: [
            /*
            {
                path: 'main', component: ConfigMainComponent
            },*/
        ]
    }
]