import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { DashboardOverviewComponent } from "./pages/overview/dashboard-overview.component";
import { REPORT_ROUTES } from "./components/reports/report.route";
import { CONFIG_ROUTES } from "./components/config/config.route";
import { USERS_ROUTES } from "./components/users/users.route";

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            // OVERVIEW - Dashboard Principal
            {
                path: '', component: DashboardOverviewComponent
            },
            //REPORTS
            {
                path: 'reports', children: REPORT_ROUTES
            },
            //CONFIG
            {
                path: 'config', children: CONFIG_ROUTES
            },
            //USERS
            {
                path: 'users', children: USERS_ROUTES
            },
        ]
    }
]