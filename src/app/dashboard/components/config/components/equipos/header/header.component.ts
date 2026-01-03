import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-equipos-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class EquiposHeaderComponent {

  private currentUrl = signal<string>('');

  readonly isCreate = computed(() =>
    this.currentUrl().endsWith('/equipos/create')
  );

  readonly title = computed(() =>
    this.isCreate() ? 'NUEVO EQUIPO' : 'EQUIPOS'
  );

  constructor(
    private router: Router,
    private destroyRef: DestroyRef
  ) {
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

  goEquiposList(): void {
    this.router.navigate(['/dashboard/config/equipos/list']);
  }
}
