import { Routes } from "@angular/router";
import { ConfigComponent } from "./config.component";
import { ConfigTableComponent } from "./tables/table.component";

export const CONFIG_ROUTES: Routes = [
    {
        path: '',
        component: ConfigComponent,
        children: [
            //REPORTS
            {
                path: '', redirectTo: 'list', pathMatch: 'full'
            },

            {
                path: 'list', component: ConfigTableComponent
            },
        ]
    }
]