import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  percentage: number;
  details?: string;
}

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group h-full">
      <!-- Gradient Border Effect -->
      <div class="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none"></div>

      <!-- Card Content -->
      <div class="relative bg-white rounded-xl border border-green-200/50 group-hover:border-green-400/30 transition-all duration-300 overflow-hidden h-full flex flex-col">
        
        <!-- Header with Gradient Line -->
        <div class="h-1 w-full bg-gradient-to-r from-green-600 to-emerald-600"></div>

        <!-- Title Section -->
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-900 mb-1">Salud del Sistema</h3>
          <div class="flex items-center gap-2 mt-3">
            <div class="w-3 h-3 rounded-full bg-green-600 animate-pulse"></div>
            <p class="text-sm text-green-600 font-semibold">Óptimo</p>
          </div>
        </div>

        <!-- Metrics List -->
        <div class="flex-1 p-6 space-y-6">
          <div *ngFor="let metric of healthMetrics" class="space-y-2">
            <!-- Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-gray-900">{{ metric.name }}</span>
                <div [class]="'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ' + getStatusClass(metric.status)">
                  {{ getStatusLabel(metric.status) }}
                </div>
              </div>
              <span class="text-sm font-bold text-gray-700">{{ metric.percentage }}%</span>
            </div>

            <!-- Progress Bar -->
            <div class="relative h-2 bg-gray-300/50 rounded-full overflow-hidden border border-gray-200/50">
              <div [class]="'h-full rounded-full transition-all duration-500 ' + getProgressColor(metric.status)"
                   [style.width.%]="metric.percentage"></div>
            </div>

            <!-- Details -->
            <p *ngIf="metric.details" class="text-xs text-gray-600">{{ metric.details }}</p>
          </div>
        </div>

        <!-- Footer Stats -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-600 font-semibold">Uptime</p>
              <p class="text-xl font-bold text-green-600 mt-1">99.99%</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 font-semibold">Respuesta</p>
              <p class="text-xl font-bold text-blue-600 mt-1">45ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SystemHealthComponent implements OnInit {
  @Input() metrics: any;

  healthMetrics: HealthMetric[] = [
    {
      name: 'Base de Datos',
      status: 'healthy',
      percentage: 98,
      details: 'Conectado • 45ms'
    },
    {
      name: 'API Server',
      status: 'healthy',
      percentage: 99,
      details: 'Online • 12ms'
    },
    {
      name: 'Cache',
      status: 'healthy',
      percentage: 97,
      details: 'Memoria 2.4GB/4GB'
    },
    {
      name: 'Almacenamiento',
      status: 'warning',
      percentage: 75,
      details: '750GB/1TB disponible'
    }
  ];

  ngOnInit(): void {
    if (this.metrics) {
      this.healthMetrics = this.metrics;
    }
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'healthy': 'bg-green-100 text-green-700 border border-green-300',
      'warning': 'bg-amber-100 text-amber-700 border border-amber-300',
      'critical': 'bg-red-100 text-red-700 border border-red-300'
    };
    return classes[status] || classes['healthy'];
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'healthy': 'Óptimo',
      'warning': 'Alerta',
      'critical': 'Crítico'
    };
    return labels[status] || 'Desconocido';
  }

  getProgressColor(status: string): string {
    const colors: { [key: string]: string } = {
      'healthy': 'bg-gradient-to-r from-green-600 to-emerald-600',
      'warning': 'bg-gradient-to-r from-amber-500 to-amber-600',
      'critical': 'bg-gradient-to-r from-red-600 to-red-700'
    };
    return colors[status] || colors['healthy'];
  }
}
