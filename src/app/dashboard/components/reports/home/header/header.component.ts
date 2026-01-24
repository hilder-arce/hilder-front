import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportsSearchService } from '../../services/reports-search.service';

@Component({
  selector: 'app-header-home-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
})
export class ReportsHomeHeaderComponent {

  private searchService = inject(ReportsSearchService);

  // MANEJAR BÚSQUEDA
  onSearch(value: string): void {
    this.searchService.setSearch(value);
  }
}
