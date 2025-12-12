import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  
  // estado global (signal)
  darkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    // Escucha los cambios del localStorage en OTRAS pestañas
    window.addEventListener('storage', (event) => {
      if (event.key === 'theme') {
        const newValue = event.newValue === 'dark';
        this.darkMode.set(newValue);
      }
    });
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('theme');
    return saved === 'dark'; // default: claro si no existe
  }

  toggleTheme() {
    const newValue = !this.darkMode();
    this.darkMode.set(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  setTheme(value: boolean) {
    this.darkMode.set(value);
    localStorage.setItem('theme', value ? 'dark' : 'light');
  }

}
