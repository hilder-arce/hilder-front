import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { EquiposSearchService } from '../services/equipos-search.service';

@Component({
  selector: 'app-equipos-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class EquiposHeaderComponent {

  // PROPIEDAD QUE CONTIENE LA URL ACTUAL
  private currentUrl = signal<string>('');

  // PROPIEDAD QUE CONTIENE LA URL LIMPIA (SIN PARÁMETROS)
  readonly cleanUrl = computed(() =>
    this.currentUrl().split('?')[0]
  );

  //PROPIEDAD QUE DETERMINA SI ESTAMOS EN LA RUTA DE CREACIÓN
  readonly isCreate = computed(() =>
    this.cleanUrl().endsWith('/create') && !this.hasIdParam()
  );

  //PROPIEDAD QUE DETERMINA SI ESTAMOS EN LA RUTA DE EDICIÓN
  readonly isEdit = computed(() =>
    this.cleanUrl().endsWith('/create') && this.hasIdParam()
  );

  //PROPIEDAD QUE DETERMINA SI ESTAMOS EN LA RUTA DE LISTA
  readonly isList = computed(() =>
    this.cleanUrl().endsWith('/equipos/list')
  );

  // TITULO DINÁMICO
  readonly title = computed(() => {
    if (this.isEdit()) return 'EDITAR EQUIPO';
    if (this.isCreate()) return 'CREAR EQUIPO';
    if (this.isList()) return 'EQUIPOS';
    return 'GESTIÓN';
  });

  // VER SI LA URL TIENE PARÁMETRO _id
  readonly hasIdParam = computed(() =>
    this.currentUrl().includes('_id=')
  );


  // INYECTAR SERVICIOS
  constructor(
    private router: Router,
    private destroyRef: DestroyRef,
    private equiposSearchService: EquiposSearchService
  ) {
    // INICIALIZAR PROPIEDAD currentUrl
    this.currentUrl.set(this.router.url);

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((e: NavigationEnd) => {
        this.currentUrl.set(e.urlAfterRedirects);
      });
  }

  // NAVEGAR A LISTA DE EQUIPOS
  goEquiposList(): void {
    this.router.navigate(['/dashboard/config/equipos']);
  }

  // MANEJAR BÚSQUEDA
  onSearch(value: string): void {
    this.equiposSearchService.setSearch(value);
  }
}
