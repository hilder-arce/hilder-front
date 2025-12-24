import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardSidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-dashboard-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        CommonModule,
    ]
})

export class DashboardHomeComponent { }