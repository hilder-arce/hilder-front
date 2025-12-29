import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    imports: [
        CommonModule
    ]
}) 

export class DashboardSidebarComponent {

    isOpen = false;

    open() { 
        this.isOpen = true;
     }
     
    close() { 
        this.isOpen = false;
     }

}