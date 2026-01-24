import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="group h-full">
      <!-- Gradient Border Effect -->
      <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none"></div>

      <!-- Card Content -->
      <div class="relative bg-white rounded-xl border border-blue-200/50 group-hover:border-blue-400/30 transition-all duration-300 overflow-hidden h-full flex flex-col">
        
        <!-- Header with Gradient Line -->
        <div class="h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <!-- Title Section -->
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-base font-bold text-gray-900">{{ title }}</h3>
          <p class="text-xs text-gray-600 mt-0.5">{{ subtitle }}</p>
        </div>

        <!-- Chart Container -->
        <div class="flex-1 px-4 py-2 flex items-center justify-center overflow-hidden min-h-0">
          <apx-chart 
            *ngIf="chartOptions"
            [series]="chartOptions.series"
            [chart]="chartOptions.chart"
            [xaxis]="chartOptions.xaxis"
            [yaxis]="chartOptions.yaxis"
            [stroke]="chartOptions.stroke"
            [tooltip]="chartOptions.tooltip"
            [dataLabels]="chartOptions.dataLabels"
            [colors]="chartOptions.colors"
            [fill]="chartOptions.fill"
            [legend]="chartOptions.legend"
            [plotOptions]="chartOptions.plotOptions"
            [labels]="chartOptions.labels"
            width="100%"
            height="100%">
          </apx-chart>
        </div>

        <!-- Footer Stats -->
        <div class="grid grid-cols-3 gap-2 p-4 border-t border-gray-200 bg-gray-50 text-center">
          <div>
            <p class="text-gray-600 text-xs font-semibold mb-0.5">Máximo</p>
            <p class="text-sm font-bold text-blue-600">{{ getMaxValue() }}</p>
          </div>
          <div>
            <p class="text-gray-600 text-xs font-semibold mb-0.5">Promedio</p>
            <p class="text-sm font-bold text-indigo-600">{{ getAverageValue() }}</p>
          </div>
          <div>
            <p class="text-gray-600 text-xs font-semibold mb-0.5">Total</p>
            <p class="text-sm font-bold text-green-600">{{ getTotalValue() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    apx-chart {
      width: 100%;
      height: 100%;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class ChartWidgetComponent implements OnInit {
  @Input() title: string = 'Gráfico';
  @Input() subtitle: string = 'Análisis de datos';
  @Input() data: any[] = [];
  @Input() chartType: 'line' | 'bar' | 'doughnut' | 'area' = 'line';
  @Input() colorGradient: [string, string] = ['#2563eb', '#4f46e5'];

  chartOptions: any = null;

  ngOnInit() {
    this.initializeChart();
  }

  initializeChart() {
    const data = this.data && this.data.length > 0 ? this.data : this.generateMockData();
    
    switch (this.chartType) {
      case 'line':
        this.chartOptions = this.createLineChart(data);
        break;
      case 'bar':
        this.chartOptions = this.createBarChart(data);
        break;
      case 'doughnut':
        this.chartOptions = this.createDoughnutChart(data);
        break;
      case 'area':
        this.chartOptions = this.createAreaChart(data);
        break;
      default:
        this.chartOptions = this.createLineChart(data);
    }
  }

  createLineChart(data: any[]): any {
    return {
      series: [
        {
          name: 'Valores',
          data: data.map(d => d.value || Math.random() * 100)
        }
      ],
      chart: {
        type: 'line',
        height: 250,
        toolbar: { show: false },
        animations: { enabled: true, speed: 800, animateGradually: { enabled: true, delay: 150 } }
      },
      xaxis: {
        categories: data.map((d, i) => d.label || `Día ${i + 1}`),
        labels: { style: { colors: '#6b7280', fontSize: '12px' } }
      },
      yaxis: {
        labels: { style: { colors: '#6b7280', fontSize: '12px' } }
      },
      stroke: { curve: 'smooth', width: 3, colors: [this.colorGradient[0]] },
      tooltip: {
        theme: 'light',
        style: { fontSize: '12px' },
        x: { show: true },
        y: { formatter: (val: any) => `${val.toFixed(1)}` }
      },
      dataLabels: { enabled: false },
      legend: { show: true, position: 'top', horizontalAlign: 'right' },
      colors: [this.colorGradient[0]],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100, 100, 100]
        }
      }
    };
  }

  createBarChart(data: any[]): any {
    return {
      series: [
        {
          name: 'Valores',
          data: data.map(d => d.value || Math.random() * 100)
        }
      ],
      chart: {
        type: 'bar',
        height: 250,
        toolbar: { show: false },
        animations: { enabled: true, speed: 800, animateGradually: { enabled: true, delay: 150 } }
      },
      xaxis: {
        categories: data.map((d, i) => d.label || `Item ${i + 1}`),
        labels: { style: { colors: '#6b7280', fontSize: '12px' } }
      },
      yaxis: {
        labels: { style: { colors: '#6b7280', fontSize: '12px' } }
      },
      colors: [this.colorGradient[0]],
      tooltip: {
        theme: 'light',
        style: { fontSize: '12px' },
        y: { formatter: (val: any) => `${val.toFixed(1)}` }
      },
      dataLabels: { enabled: true, formatter: (val: any) => `${val.toFixed(0)}` },
      legend: { show: true, position: 'top' },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '60%',
          dataLabels: { position: 'top' }
        }
      }
    };
  }

  createDoughnutChart(data: any[]): any {
    const values = data.map(d => d.value || Math.random() * 100);
    const labels = data.map((d, i) => d.label || `Categoría ${i + 1}`);
    
    return {
      series: values,
      labels: labels,
      chart: {
        type: 'donut',
        height: 250,
        toolbar: { show: false },
        animations: { enabled: true, speed: 800, animateGradually: { enabled: true, delay: 150 } }
      },
      colors: ['#2563eb', '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      tooltip: {
        theme: 'light',
        y: { formatter: (val: any) => `${val.toFixed(1)}` }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any) => `${val.toFixed(1)}%`
      },
      legend: { show: true, position: 'bottom', fontSize: '12px' },
      plotOptions: {
        pie: {
          donut: {
            size: '60%',
            labels: {
              show: true,
              total: {
                show: true,
                fontSize: '14px',
                fontWeight: 600,
                color: '#1f2937'
              }
            }
          }
        }
      }
    };
  }

  createAreaChart(data: any[]): any {
    return {
      series: [
        {
          name: 'Valores',
          data: data.map(d => d.value || Math.random() * 100)
        }
      ],
      chart: {
        type: 'area',
        height: 250,
        toolbar: { show: false },
        animations: { enabled: true, speed: 800, animateGradually: { enabled: true, delay: 150 } }
      },
      xaxis: {
        categories: data.map((d, i) => d.label || `Período ${i + 1}`),
        labels: { style: { colors: '#6b7280', fontSize: '12px' } }
      },
      yaxis: {
        labels: { style: { colors: '#6b7280', fontSize: '12px' } }
      },
      stroke: { curve: 'smooth', width: 2, colors: [this.colorGradient[0]] },
      tooltip: {
        theme: 'light',
        style: { fontSize: '12px' },
        y: { formatter: (val: any) => `${val.toFixed(1)}` }
      },
      dataLabels: { enabled: false },
      legend: { show: true, position: 'top' },
      colors: [this.colorGradient[0]],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      }
    };
  }

  generateMockData() {
    return Array.from({ length: 12 }, (_, i) => ({
      label: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i],
      value: Math.floor(Math.random() * 100) + 20
    }));
  }

  getMaxValue(): string {
    const values = this.data && this.data.length > 0 
      ? this.data.map(d => d.value || 0) 
      : [];
    return values.length > 0 ? Math.max(...values).toFixed(0) : '0';
  }

  getAverageValue(): string {
    const values = this.data && this.data.length > 0 
      ? this.data.map(d => d.value || 0) 
      : [];
    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    return avg.toFixed(1);
  }

  getTotalValue(): string {
    const values = this.data && this.data.length > 0 
      ? this.data.map(d => d.value || 0) 
      : [];
    return values.reduce((a, b) => a + b, 0).toFixed(0);
  }
}
