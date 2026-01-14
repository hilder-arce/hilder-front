import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { MaterialsSearchService } from '../services/materials-search.service';

@Component({
  selector: 'app-materiales-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class MaterialesHeaderComponent {

  // URL ACTUAL
  private currentUrl = signal<string>('');

  // URL LIMPIA (SIN QUERY PARAMS)
  readonly cleanUrl = computed(() =>
    this.currentUrl().split('?')[0]
  );

  // DETECTAR _id
  readonly hasIdParam = computed(() =>
    this.currentUrl().includes('_id=')
  );

  // ESTADOS DE RUTA
  readonly isCreate = computed(() =>
    this.cleanUrl().endsWith('/create') && !this.hasIdParam()
  );

  readonly isEdit = computed(() =>
    this.cleanUrl().endsWith('/create') && this.hasIdParam()
  );

  readonly isList = computed(() =>
    this.cleanUrl().endsWith('/materiales/list')
  );

  // TÍTULO DINÁMICO
  readonly title = computed(() => {
    if (this.isEdit()) return 'EDITAR MATERIAL';
    if (this.isCreate()) return 'NUEVO MATERIAL';
    if (this.isList()) return 'MATERIALES';
    return 'GESTIÓN';
  });

  constructor(
    private router: Router,
    private destroyRef: DestroyRef,
    private materialesSearchService: MaterialsSearchService
  ) {
    // Estado inicial
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

  // IR A LISTA
  goMaterialesList(): void {
    this.router.navigate(['/dashboard/config/materiales']);
  }

  // SEARCH (alineado con Explosivos)
  onSearch(term: string): void {
    this.materialesSearchService.setSearch(term);
  }
}
