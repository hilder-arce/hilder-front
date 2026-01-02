import { Component } from '@angular/core';
import { ButtonLoginComponent } from '../../shared/componets/button-login/button-login.component';
import { ButtonDashboardComponent } from '../../shared/componets/button-dashboard/button-dashboard.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { LayoutStateService } from '../../shared/services/layout-state.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    ButtonLoginComponent,
    ButtonDashboardComponent,
    SidebarComponent,
    CommonModule,
  ]
})
export class HeaderComponent {

  constructor(
    public layout: LayoutStateService,
    public auth: AuthService
  ) { }

}
