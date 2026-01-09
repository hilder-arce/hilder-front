import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { ExplosivosSearchService } from '../services/explosivos-search.service';

@Component({
  selector: 'app-explosivos-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class ExplosivosHeaderComponent {

  // PROPIEDAD QUE CONTIENE LA URL ACTUAL
  private currentUrl = signal<string>('');

  //PROPIEDAD QUE CONTIENE LA URL LIMPIA (SIN PARÁMETROS)
  readonly cleanUrl = computed(() =>
    this.currentUrl().split('?')[0]
  );

  // VER SI LA URL TIENE PARÁMETRO _id
  readonly hasIdParam = computed(() =>
    this.currentUrl().includes('_id=')
  );

  // PROPIEDAD QUE DETERMINA SI ESTAMOS EN LA RUTA DE CREACIÓN
  readonly isCreate = computed(() =>
    this.cleanUrl().endsWith('/create') && !this.hasIdParam()
  );

  //PROPIEDAD QUE DETERMINA SI ESTAMOS EN LA RUTA DE EDICIÓN
  readonly isEdit = computed(() =>
    this.cleanUrl().endsWith('/create') && this.hasIdParam()
  );

  //PROPIEDAD QUE DETERMINA SI ESTAMOS EN LA RUTA DE LISTA
  readonly isList = computed(() =>
    this.cleanUrl().endsWith('/explosivos/list')
  );

  // TITULO DINÁMICO
  readonly title = computed(() => {
    if (this.isEdit()) return 'EDITAR EXPLOSIVO';
    if (this.isCreate()) return 'NUEVO EXPLOSIVO';
    if (this.isList()) return 'EXPLOSIVOS';
    return 'GESTIÓN';
  });

  // INYECTAR SERVICIOS
  constructor(
    private router: Router,
    private destroyRef: DestroyRef,
    private explosivosSearchService: ExplosivosSearchService
  ) {
    // Inicial
    this.currentUrl.set(this.router.url);

    // Escuchar navegación
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((e: NavigationEnd) => {
        this.currentUrl.set(e.urlAfterRedirects);
      });
  }

  // NAVEGAR A LISTA DE EXPLOSIVOS
  goExplosivosList(): void {
    this.router.navigate(['/dashboard/config/explosivos']);
  }

  //MANEJAR EVENTO DE BÚSQUEDA
  onSearch(term: string): void {
    this.explosivosSearchService.setSearch(term);
  }
}
