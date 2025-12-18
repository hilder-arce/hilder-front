import { Injectable, computed, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutStateService {

  // Signal base: URL actual
  private currentUrl = signal<string>('');

  // Computed: ¿estoy en /login?
  readonly isRouteLogin = computed(() => this.currentUrl() === '/login');

  constructor(private router: Router) {
    // Valor inicial
    this.currentUrl.set(this.router.url);

    // Escucha cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }
}
