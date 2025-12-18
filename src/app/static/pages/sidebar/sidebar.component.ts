import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonLoginComponent } from '../../../shared/componets/button-login/button-login.component';
import { ThemeService } from '../../../shared/services/theme.service';
import { LayoutStateService } from '../../../shared/services/layout-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [
    RouterModule,
    CommonModule,
    ButtonLoginComponent
  ]
})
export class SidebarComponent {

  //CONTEOLAR LA VISIBILIDAD DEL SIDEBAR
  visibilitySidebar = false;

    constructor(
      public theme: ThemeService,
       public layout: LayoutStateService,
       private el: ElementRef
    ){}

    close() {
      this.visibilitySidebar = !this.visibilitySidebar;
    }

    // Detecta clics globales
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    const clickedInside = this.el.nativeElement.contains(event.target);

    // Si está abierto y el click fue fuera → cerrar
    if (this.visibilitySidebar && !clickedInside) {
      this.visibilitySidebar = false;
    }
  }

}
