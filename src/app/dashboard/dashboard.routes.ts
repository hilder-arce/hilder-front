import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { REPORT_ROUTES } from "./components/reports/report.route";
import { CONFIG_ROUTES } from "./components/config/config.route";

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            //REPORTS
            {
                path: 'reports', children: REPORT_ROUTES
            },
            //CONFIG
            {
                path: 'config', children: CONFIG_ROUTES
            },
        ]
    }
]