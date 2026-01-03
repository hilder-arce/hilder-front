import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';

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

    constructor(
        public auth: AuthService, 
        private el: ElementRef,
        private alertService: AlertService,
        private router: Router
    ){}

    close () {
        this.open = false
    }

    openSidebar() {
        this.open = true
    }

    // Detecta clics globales
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    const clickedInside = this.el.nativeElement.contains(event.target);

    // Si está abierto y el click fue fuera → cerrar
    if (this.open && !clickedInside) {
      this.close()
    }
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