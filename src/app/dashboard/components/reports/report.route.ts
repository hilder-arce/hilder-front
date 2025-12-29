import { Routes } from "@angular/router";
import { ReportComponent } from "./main/main.component";
import { ReportCreateComponent } from "./create/report-create.component";
import { ReportTableComponent } from "./tables/table.component";

export const REPORT_ROUTES: Routes = [
    {
        path: '',
        component: ReportComponent,
        children: [
            //REPORTS
            {
                path: '', redirectTo: 'list', pathMatch: 'full'
            },
            {
                path: 'create', component: ReportCreateComponent
            },
            {
                path: 'list', component: ReportTableComponent
            },
        ]
    }
]