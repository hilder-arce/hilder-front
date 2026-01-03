import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-dashboard-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    imports: [
        CommonModule,
        RouterModule
    ]
})

export class DashboardSidebarComponent {

    @Input() isCollapsed = false;

    @Output() toggle = new EventEmitter<void>();

    constructor(public auth: AuthService) {}

    onToggle() {
        this.toggle.emit();
    }

    logout() {
        
    }
  
}