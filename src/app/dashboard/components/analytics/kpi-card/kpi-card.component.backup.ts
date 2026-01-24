import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente Premium de Dashboard KPI
 * 
 * Uso:
 * <app-kpi-card 
 *   [label]="'Total Inventario'"
 *   [value]="1250"
 *   [change]="'+12.5%'"
 *   [icon]="'inventory'"
 *   [colorGradient]="'from-blue-600 to-blue-400'">
 * </app-kpi-card>
 */

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group h-full cursor-pointer">
      <!-- Gradient Border Effect -->
      <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-500 pointer-events-none"></div>

      <!-- Card Content -->
      <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 group-hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col hover:shadow-2xl">
        
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <p class="text-slate-400 text-sm font-semibold mb-1">{{ label }}</p>
          </div>
          <!-- Icon -->
          <div class="p-3 rounded-lg bg-gradient-to-br bg-opacity-10 border border-slate-600/50 group-hover:border-opacity-100 transition-colors"
               [ngClass]="'bg-gradient-to-br ' + colorGradient">
            <svg class="w-6 h-6" [attr.data-icon]="icon" fill="currentColor" viewBox="0 0 24 24" [ngSwitch]="icon">
              <!-- Inventory Icon -->
              <g *ngSwitchCase="'inventory'" class="text-blue-400">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5h3l-6-7zm-8 12H5v-2h7v2zm3-4H5v-2h10v2zm0-4H5V8h10v4z"/>
              </g>
              <!-- Equipment Icon -->
              <g *ngSwitchCase="'equipment'" class="text-green-400">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </g>
              <!-- Explosives Icon -->
              <g *ngSwitchCase="'explosives'" class="text-red-400">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </g>
              <!-- Materials Icon -->
              <g *ngSwitchCase="'materials'" class="text-purple-400">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.16-2.66c-.23-.29-.61-.37-.95-.15-.34.21-.51.61-.38.99l3 7.21c.23.57.77.92 1.38.92.61 0 1.15-.35 1.38-.92l4-6.5c.13-.38-.04-.78-.38-.99-.34-.21-.72-.14-.95.15z"/>
              </g>
            </svg>
          </div>
        </div>

        <!-- Value Section -->
        <div class="flex-1 mb-4">
          <div class="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
            {{ formatValue(value) }}
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-700/30">
          <div [class]="'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ' + getChangeClasses()">
            <span [class]="getChangeIcon()"></span>
            {{ change }}
          </div>
          <span class="text-xs text-slate-500">vs. mes anterior</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
    }

    :host-context(.group:hover) {
      animation: float 3s ease-in-out infinite;
    }
  `]
})
export class KpiCardComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() change: string = '+0%';
  @Input() icon: string = 'inventory';
  @Input() colorGradient: string = 'from-blue-600 to-blue-400';

  formatValue(value: number): string {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  }

  getChangeClasses(): string {
    const isPositive = !this.change.includes('-');
    return isPositive
      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
      : 'bg-red-500/20 text-red-400 border border-red-500/30';
  }

  getChangeIcon(): string {
    const isPositive = !this.change.includes('-');
    return isPositive ? '↑' : '↓';
  }
}
