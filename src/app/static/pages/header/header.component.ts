import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from '../../../services/theme';
import { ButtonLoginComponent } from '../../../shared/componets/button-login/button-login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    ButtonLoginComponent
  ]
})
export class HeaderComponent {

  constructor(public theme: ThemeService){}

  @Output() toggleSidebar = new EventEmitter<void>();

  openSidebar() {
    this.toggleSidebar.emit();
  }

}
