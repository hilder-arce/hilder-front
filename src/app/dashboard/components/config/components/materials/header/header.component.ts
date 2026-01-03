import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-materiales-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class MaterialesHeaderComponent {

  private currentUrl = signal<string>('');

  readonly isCreate = computed(() =>
    this.currentUrl().endsWith('/materiales/create')
  );

  readonly title = computed(() =>
    this.isCreate() ? 'NUEVO MATERIAL' : 'MATERIALES'
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

  goMaterialesList(): void {
    this.router.navigate(['/dashboard/config/materiales/list']);
  }
}
