import { Routes } from "@angular/router";
import { UsersComponent } from "./users.component";
import { RegisterComponent } from "../../../auth/register/register.component";
import { UsersTableComponent } from "./tables/table.component";

export const USERS_ROUTES: Routes = [
    {
        path: '',
        component: UsersComponent,
        children: [
            //REPORTS
            {
                path: '', redirectTo: 'list', pathMatch: 'full'
            },
            {
                path: 'create', component: RegisterComponent
            },
            {
                path: 'list', component: UsersTableComponent
            },
        ]
    }
]