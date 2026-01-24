import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { EquipoService } from '../components/config/components/equipos/services/equipo.service';
import { ExplosivoService } from '../components/config/components/explosivos/services/explosivo.service';
import { MaterialService } from '../components/config/components/materials/services/material.service';

interface DashboardData {
  stats: {
    totalInventario: number;
    inventarioChange: string;
    equiposActivos: number;
    equiposChange: string;
    explosivosStock: number;
    explosivosChange: string;
    materiales: number;
    materialesChange: string;
  };
  charts: {
    inventoryTrend: any[];
    equipmentDistribution: any[];
    explosivesStatus: any[];
    materialsByType: any[];
  };
  recentActivities: any[];
  systemMetrics: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private equipoService: EquipoService,
    private explosivoService: ExplosivoService,
    private materialService: MaterialService
  ) {}

  getDashboardData(): Observable<DashboardData> {
    return this.loadAllData().pipe(
      map(data => this.transformData(data)),
      delay(800) // Simular carga
    );
  }

  private loadAllData(): Observable<any> {
    return new Observable(observer => {
      Promise.all([
        this.equipoService.getEquipos(),
        this.explosivoService.getExplosivos(),
        this.materialService.getMateriales()
      ]).then(([equipos, explosivos, materiales]) => {
        observer.next({
          equipos: equipos || [],
          explosivos: explosivos || [],
          materiales: materiales || []
        });
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  private transformData(rawData: any): DashboardData {
    const equipos = rawData.equipos || [];
    const explosivos = rawData.explosivos || [];
    const materiales = rawData.materiales || [];

    return {
      stats: {
        totalInventario: equipos.length + explosivos.length + materiales.length,
        inventarioChange: '+12.5%',
        equiposActivos: equipos.length,
        equiposChange: '+8.2%',
        explosivosStock: explosivos.length,
        explosivosChange: '-3.1%',
        materiales: materiales.length,
        materialesChange: '+5.8%'
      },
      charts: {
        inventoryTrend: this.generateInventoryTrend(),
        equipmentDistribution: this.groupByMarca(equipos),
        explosivesStatus: this.groupByTipo(explosivos),
        materialsByType: this.groupByUnidad(materiales)
      },
      recentActivities: this.generateRecentActivities(),
      systemMetrics: this.generateSystemMetrics()
    };
  }

  private generateInventoryTrend(): any[] {
    const meses = ['Enero', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    return meses.map((mes, i) => ({
      label: mes,
      value: Math.floor(Math.random() * 300) + 200
    }));
  }

  private groupByMarca(equipos: any[]): any[] {
    const grouped: { [key: string]: number } = {};
    equipos.forEach(eq => {
      const marca = eq.marca || 'Otros';
      grouped[marca] = (grouped[marca] || 0) + 1;
    });

    return Object.entries(grouped).map(([marca, cantidad]) => ({
      label: marca,
      value: cantidad as number
    }));
  }

  private groupByTipo(explosivos: any[]): any[] {
    const grouped: { [key: string]: number } = {};
    explosivos.forEach(exp => {
      const tipo = exp.tipo || 'Otros';
      grouped[tipo] = (grouped[tipo] || 0) + 1;
    });

    return Object.entries(grouped).map(([tipo, cantidad]) => ({
      label: tipo,
      value: cantidad as number
    }));
  }

  private groupByUnidad(materiales: any[]): any[] {
    const grouped: { [key: string]: number } = {};
    materiales.forEach(mat => {
      const unidad = mat.unidad || 'Otros';
      grouped[unidad] = (grouped[unidad] || 0) + 1;
    });

    return Object.entries(grouped).map(([unidad, cantidad]) => ({
      label: unidad,
      value: cantidad as number
    }));
  }

  private generateRecentActivities(): any[] {
    const activities = [
      {
        id: '1',
        type: 'create',
        title: 'Nuevo equipo registrado',
        description: 'Se agregó una excavadora Caterpillar al inventario',
        timestamp: new Date(Date.now() - 5 * 60000),
        user: 'Sistema'
      },
      {
        id: '2',
        type: 'update',
        title: 'Actualización de stock',
        description: 'Stock de dinamita actualizado a 250 unidades',
        timestamp: new Date(Date.now() - 30 * 60000),
        user: 'Admin'
      },
      {
        id: '3',
        type: 'alert',
        title: 'Alerta de stock bajo',
        description: 'Los detonadores están por debajo del nivel mínimo',
        timestamp: new Date(Date.now() - 2 * 3600000),
        user: 'Sistema'
      },
      {
        id: '4',
        type: 'update',
        title: 'Mantenimiento completado',
        description: 'Mantenimiento preventivo realizado en 5 equipos',
        timestamp: new Date(Date.now() - 24 * 3600000),
        user: 'Técnico'
      }
    ];

    return activities;
  }

  private generateSystemMetrics(): any[] {
    return [
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
  }

  // Métodos para obtener datos específicos por módulo
  getEquipmentAnalytics(): Observable<any> {
    return new Observable(observer => {
      this.equipoService.getEquipos().then(equipos => {
        observer.next({
          total: equipos?.length || 0,
          byMarca: this.groupByMarca(equipos || []),
          active: equipos?.filter((e: any) => e.estado === 'activo').length || 0
        });
        observer.complete();
      });
    });
  }

  getExplosivesAnalytics(): Observable<any> {
    return new Observable(observer => {
      this.explosivoService.getExplosivos().then(explosivos => {
        observer.next({
          total: explosivos?.length || 0,
          byTipo: this.groupByTipo(explosivos || []),
          alerts: explosivos?.filter((e: any) => e.stock < e.minimo).length || 0
        });
        observer.complete();
      });
    });
  }

  getMaterialsAnalytics(): Observable<any> {
    return new Observable(observer => {
      this.materialService.getMateriales().then(materiales => {
        observer.next({
          total: materiales?.length || 0,
          byUnidad: this.groupByUnidad(materiales || []),
          lowStock: materiales?.filter((m: any) => m.stock < m.minimo).length || 0
        });
        observer.complete();
      });
    });
  }
}
