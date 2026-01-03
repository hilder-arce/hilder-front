import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';

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

    constructor(public auth: AuthService, private alertService: AlertService, private router: Router) {}

    onToggle() {
        this.toggle.emit();
    }

    async logout() {

        const res = await this.auth.logout()
        if(res?.message  === 'Sesion cerrada correctamente.'){
            this.auth.checkSession();
            this.alertService.show(res?.message, 'success');
          // navegar al home public
          this.router.navigate(['/home']);
        } else {
          this.alertService.show('No se puede cerrar sesion.', 'error');
        }
    }
  
}