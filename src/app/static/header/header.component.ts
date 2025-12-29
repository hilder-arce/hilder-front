import { Component } from '@angular/core';
import { ThemeService } from '../../shared/services/theme.service';
import { ButtonLoginComponent } from '../../shared/componets/button-login/button-login.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { LayoutStateService } from '../../shared/services/layout-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    ButtonLoginComponent,
    SidebarComponent,
    CommonModule
  ]
})
export class HeaderComponent {

  constructor(
    public theme: ThemeService,
    public layout: LayoutStateService
  ) { }

}
