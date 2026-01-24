import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, signal, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { ReportsSearchService } from '../../../services/reports-search.service';

@Component({
  selector: 'app-header-explosivos-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
})
export class ReportsExplosivosHeaderComponent {
  private searchService = inject(ReportsSearchService);

  // MANEJAR BÚSQUEDA
  onSearch(value: string): void {
    this.searchService.setSearch(value);
  }
}
