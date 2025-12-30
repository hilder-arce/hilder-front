import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard-sidebar-mobile',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    imports: [
        CommonModule,
        RouterModule
    ]
})

export class DashboardSidebarMobileComponent {

    open = false

    close () {
        this.open = false
    }

    openSidebar() {
        this.open = true
    }

  
}