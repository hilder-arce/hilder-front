import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSidebarComponent } from './static/sidebar/sidebar.component';
import { DashboardSidebarMobileComponent } from './static/sidebar-mobile/sidebar.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    imports: [
        RouterOutlet,
        CommonModule,
        DashboardSidebarComponent,
        DashboardSidebarMobileComponent
    ]
})

export class DashboardComponent {

    isSidebarCollapsed = false;

    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }

}