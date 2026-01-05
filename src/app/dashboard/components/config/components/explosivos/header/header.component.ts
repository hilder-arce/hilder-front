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
    styleUrl: './header.component.css',
})
export class ExplosivosHeaderComponent {

    // URL actual (inicializada correctamente)
    private currentUrl = signal<string>('');

    // true solo cuando está en /explosivos/create
    readonly isCreate = computed(() =>
        this.currentUrl().endsWith('/explosivos/create')
    );

    // Título dinámico
    readonly title = computed(() =>
        this.isCreate() ? 'NUEVO EXPLOSIVO' : 'EXPLOSIVOS'
    );

    constructor(
        private router: Router,
        private destroyRef: DestroyRef
    ) {
        // 🔑 CLAVE: inicializar con la URL actual (recarga directa)
        this.currentUrl.set(this.router.url);

        // Escuchar cambios de ruta
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((event: NavigationEnd) => {
                this.currentUrl.set(event.urlAfterRedirects);
            });
    }

    // Volver a la lista
    goExplosivosList(): void {
        this.router.navigate(['/dashboard/config/explosivos']);
    }
}
