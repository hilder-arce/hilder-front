import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';
import { LoaderComponent } from '../../../shared/componets/loader/loader.component';
import { DashboardHeroComponent } from '../../components/hero/dashboard-hero.component';
import { KpiCardComponent } from '../../components/analytics/kpi-card/kpi-card.component';
import { ChartWidgetComponent } from '../../components/analytics/chart-widget/chart-widget.component';
import { RecentActivityComponent } from '../../components/analytics/recent-activity/recent-activity.component';
import { SystemHealthComponent } from '../../components/analytics/system-health/system-health.component';

interface ChartData {
  inventoryTrend: any[];
  equipmentDistribution: any[];
  explosivesStatus: any[];
  materialsByType: any[];
}

interface DashboardData {
  stats: any;
  charts: ChartData;
  recentActivities: any[];
  systemMetrics: any;
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    DashboardHeroComponent,
    KpiCardComponent,
    ChartWidgetComponent,
    RecentActivityComponent,
    SystemHealthComponent
  ],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.css'
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {
  isLoading = true;
  private destroy$ = new Subject<void>();

  kpiData = [
    { label: 'Total Inventario', value: 0, change: '+12.5%', icon: 'inventory', color: 'from-blue-600 to-blue-400' },
    { label: 'Equipos Activos', value: 0, change: '+8.2%', icon: 'equipment', color: 'from-green-600 to-green-400' },
    { label: 'Explosivos Stock', value: 0, change: '-3.1%', icon: 'explosives', color: 'from-red-600 to-red-400' },
    { label: 'Materiales', value: 0, change: '+5.8%', icon: 'materials', color: 'from-purple-600 to-purple-400' }
  ];

  chartData: ChartData = {
    inventoryTrend: [],
    equipmentDistribution: [],
    explosivesStatus: [],
    materialsByType: []
  };

  recentActivities: any[] = [];
  systemMetrics: any = {};

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.dashboardService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: DashboardData) => {
          this.updateKPIData(data);
          this.chartData = data.charts;
          this.recentActivities = data.recentActivities;
          this.systemMetrics = data.systemMetrics;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error cargando datos del dashboard:', error);
          this.isLoading = false;
        }
      });
  }

  private updateKPIData(data: DashboardData): void {
    this.kpiData = [
      { 
        ...this.kpiData[0], 
        value: data.stats.totalInventario,
        change: data.stats.inventarioChange
      },
      { 
        ...this.kpiData[1], 
        value: data.stats.equiposActivos,
        change: data.stats.equiposChange
      },
      { 
        ...this.kpiData[2], 
        value: data.stats.explosivosStock,
        change: data.stats.explosivosChange
      },
      { 
        ...this.kpiData[3], 
        value: data.stats.materiales,
        change: data.stats.materialesChange
      }
    ];
  }
}
