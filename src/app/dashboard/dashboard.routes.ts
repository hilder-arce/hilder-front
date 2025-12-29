import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { REPORT_ROUTES } from "./components/reports/report.route";

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: '', redirectTo: 'reports', pathMatch: 'full'
            },
            //REPORTS
            {
                path: 'reports', children: REPORT_ROUTES
            },
        ]
    }
]