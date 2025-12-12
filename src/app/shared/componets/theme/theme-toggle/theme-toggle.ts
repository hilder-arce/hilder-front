import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  template: `
    <button 
      (click)="theme.toggleTheme()"
      class="p-2 rounded-full border transition-all
             fixed bottom-5 right-5 z-[9999]
             cursor-pointer
             hover:scale-110 hover:shadow-lg"
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
