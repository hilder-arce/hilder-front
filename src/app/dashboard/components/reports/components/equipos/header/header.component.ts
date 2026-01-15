import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-equipos-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
})
export class ReportsequiposHeaderComponent {

  minDate: string = '2026-01-01';
  maxDate: string = new Date().toISOString().split('T')[0];
  startDate: string = '';
  endDate: string = '';

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
    this.cleanUrl().endsWith('/reports/home')
  );

  // TITULO DINÁMICO
  readonly title = computed(() => {
    if (this.isEdit()) return 'EDITAR REPORTE';
    if (this.isCreate()) return 'CREAR REPORTE';
    if (this.isList()) return 'REPORTES';
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

  // NAVEGAR AL HOME DE REPORTES
  goReportsHome(): void {
    this.router.navigate(['/dashboard/reports/home']);
  }

  // MANEJAR BÚSQUEDA
  onSearch(value: string): void {
    //this.equiposSearchService.setSearch(value);
  }
}
