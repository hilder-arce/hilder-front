import { Component, computed, DestroyRef, signal } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class UsersHeaderComponent {

  private currentUrl = signal('');
  private hasUserId = signal(false);

  readonly isCreate = computed(() =>
    this.currentUrl().endsWith('/users/create') && !this.hasUserId()
  );

  readonly isEdit = computed(() =>
    this.currentUrl().endsWith('/users/create') && this.hasUserId()
  );

  readonly title = computed(() => {
    if (this.isEdit()) return 'EDITAR USUARIO';
    if (this.isCreate()) return 'NUEVO USUARIO';
    return 'USUARIOS';
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {
    // inicial
    this.syncState();

    // cambios de navegación
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.syncState());
  }

  private syncState() {
    this.currentUrl.set(this.router.url.split('?')[0]);

    const id = this.route.snapshot.queryParamMap.get('_id');
    this.hasUserId.set(!!id);
  }

  goReportList() {
    this.router.navigate(['/dashboard/users/list']);
  }
}
