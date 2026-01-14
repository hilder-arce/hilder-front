import { Routes } from "@angular/router";
import { ReportCreateComponent } from "./create/report-create.component";
import { ReportsHomeComponent } from "./home/home.component";
import { ReportComponent } from "./report.component";
import { EQUIPOS_ROUTES } from "./components/equipos/equipos.route";
import { EXPLOSIVOS_ROUTES } from "./components/explosivos/explosivos.route";
import { MATERIALES_ROUTES } from "./components/materials/materiales.route";

export const REPORT_ROUTES: Routes = [
    {
        path: '',
        component: ReportComponent,
        children: [
            //REPORTS
            {
                path: '', redirectTo: 'home', pathMatch: 'full'
            },
            {
                path: 'create', component: ReportCreateComponent
            },
            {
                path: 'home', component: ReportsHomeComponent
            },
            //EQUIPOS
            {
                path: 'equipos', children: EQUIPOS_ROUTES
            },
            //EXPLLOSIVOS
            {
                path: 'explosivos', children: EXPLOSIVOS_ROUTES
            },
            //MATERIALES
            {
                path: 'materiales', children: MATERIALES_ROUTES
            }
        ]
    }
]