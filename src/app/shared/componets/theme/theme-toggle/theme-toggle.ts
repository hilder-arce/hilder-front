import { Component } from '@angular/core';
import { ThemeService } from '../../../../services/theme';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  template: `
    <button 
      (click)="theme.toggleTheme()"
      class="p-2 rounded-full border transition-all
             fixed top-4 right-4 z-50"
      [class.bg-white]="!theme.darkMode()"
      [class.text-black]="!theme.darkMode()"
      [class.bg-black]="theme.darkMode()"
      [class.text-white]="theme.darkMode()"
    >
      {{ theme.darkMode() ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggleComponent {

  constructor(public theme: ThemeService){}

}
