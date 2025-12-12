import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonLoginComponent } from '../../../shared/componets/button-login/button-login.component';
import { ThemeService } from '../../../shared/services/theme.service';

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

    constructor(public theme: ThemeService){}

    close() {
      this.visibilitySidebar = !this.visibilitySidebar;
    }


}
