import { Component, } from '@angular/core';
import { ThemeService } from '../../../services/theme';
import { ButtonLoginComponent } from '../../../shared/componets/button-login/button-login.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    ButtonLoginComponent,
    SidebarComponent
  ]
})
export class HeaderComponent {

  constructor(public theme: ThemeService){}

}
