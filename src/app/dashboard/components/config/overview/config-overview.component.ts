import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipoService } from '../components/equipos/services/equipo.service';
import { ExplosivoService } from '../components/explosivos/services/explosivo.service';
import { MaterialService } from '../components/materials/services/material.service';
import { Equipo } from '../components/equipos/interfaces/equipo.interface';
import { Explosivo } from '../components/explosivos/interfaces/explosivo.interface';
import { Material } from '../components/materials/interfaces/material.interface';

@Component({
  selector: 'app-config-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config-overview.component.html',
  styleUrl: './config-overview.component.css'
})
export class ConfigOverviewComponent implements OnInit {

  stats = {
    equipos: 0,
    explosivos: 0,
    materiales: 0
  };

  tiposExplosivos: Array<{ tipo: string; cantidad: number; color: string }> = [];
  tiposEquipos: Array<{ tipo: string; cantidad: number; color: string }> = [];
  tiposMateriales: Array<{ tipo: string; cantidad: number; color: string }> = [];

  isLoading = true;

  constructor(
    private equipoService: EquipoService,
    private explosivoService: ExplosivoService,
    private materialService: MaterialService
  ) {}

  async ngOnInit() {
    try {
      await this.loadData();
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.isLoading = false;
    }
  }

  async loadData() {
    const [equipos, explosivos, materiales] = await Promise.all([
      this.equipoService.getEquipos(),
      this.explosivoService.getExplosivos(),
      this.materialService.getMateriales()
    ]);

    this.processEquipos(equipos || []);
    this.processExplosivos(explosivos || []);
    this.processMateriales(materiales || []);

    this.stats.equipos = equipos?.length || 0;
    this.stats.explosivos = explosivos?.length || 0;
    this.stats.materiales = materiales?.length || 0;

    this.isLoading = false;
  }

  processEquipos(equipos: Equipo[]) {
    const equiposPorMarca: { [key: string]: number } = {};
    const colores: { [key: string]: string } = {
      'Makita': '#3b82f6',
      'Bosch': '#06b6d4',
      'Dewalt': '#10b981',
      'Caterpillar': '#6366f1',
      'Otros': '#8b5cf6'
    };

    equipos.forEach(eq => {
      const marca = eq.marca || 'Otros';
      equiposPorMarca[marca] = (equiposPorMarca[marca] || 0) + 1;
    });

    this.tiposEquipos = Object.entries(equiposPorMarca)
      .map(([tipo, cantidad]) => ({
        tipo,
        cantidad,
        color: colores[tipo] || '#8b5cf6'
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  processExplosivos(explosivos: Explosivo[]) {
    const explosivosPorTipo: { [key: string]: number } = {};
    const colores: { [key: string]: string } = {
      'Dinamita': '#ef4444',
      'Detonadores': '#f97316',
      'Cordón detonante': '#eab308',
      'Otros': '#8b5cf6'
    };

    explosivos.forEach(exp => {
      const tipo = exp.tipo || 'Otros';
      explosivosPorTipo[tipo] = (explosivosPorTipo[tipo] || 0) + 1;
    });

    this.tiposExplosivos = Object.entries(explosivosPorTipo)
      .map(([tipo, cantidad]) => ({
        tipo,
        cantidad,
        color: colores[tipo] || '#8b5cf6'
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  processMateriales(materiales: Material[]) {
    const materialesPorUnidad: { [key: string]: number } = {};
    const colores: { [key: string]: string } = {
      'metros': '#ec4899',
      'kg': '#f59e0b',
      'sacos': '#14b8a6',
      'litros': '#a855f7',
      'unidades': '#ef4444',
      'Otros': '#64748b'
    };

    materiales.forEach(mat => {
      const unidad = mat.unidad || 'Otros';
      materialesPorUnidad[unidad] = (materialesPorUnidad[unidad] || 0) + 1;
    });

    this.tiposMateriales = Object.entries(materialesPorUnidad)
      .map(([tipo, cantidad]) => ({
        tipo,
        cantidad,
        color: colores[tipo] || '#64748b'
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  getPercentage(valor: number, total: number): number {
    return total > 0 ? (valor / total) * 100 : 0;
  }

  getTotalExplosivos(): number {
    return this.tiposExplosivos.reduce((sum, item) => sum + item.cantidad, 0);
  }

  getTotalEquipos(): number {
    return this.tiposEquipos.reduce((sum, item) => sum + item.cantidad, 0);
  }

  getTotalMateriales(): number {
    return this.tiposMateriales.reduce((sum, item) => sum + item.cantidad, 0);
  }
}

