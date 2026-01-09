import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-explosivos-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class ExplosivosHeaderComponent {

  // URL actual
  private currentUrl = signal<string>('');

  // URL limpia (sin query params)
  readonly cleanUrl = computed(() =>
    this.currentUrl().split('?')[0]
  );

  // ¿Tiene _id? → edición
  readonly hasIdParam = computed(() =>
    this.currentUrl().includes('_id=')
  );

  // Estados
  readonly isCreate = computed(() =>
    this.cleanUrl().endsWith('/create') && !this.hasIdParam()
  );

  readonly isEdit = computed(() =>
    this.cleanUrl().endsWith('/create') && this.hasIdParam()
  );

  readonly isList = computed(() =>
    this.cleanUrl().endsWith('/explosivos/list')
  );

  // Título dinámico
  readonly title = computed(() => {
    if (this.isEdit()) return 'EDITAR EXPLOSIVO';
    if (this.isCreate()) return 'NUEVO EXPLOSIVO';
    if (this.isList()) return 'EXPLOSIVOS';
    return 'GESTIÓN';
  });

  constructor(
    private router: Router,
    private destroyRef: DestroyRef
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

  goExplosivosList(): void {
    this.router.navigate(['/dashboard/config/explosivos']);
  }
}
