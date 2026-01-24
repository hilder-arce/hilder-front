import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReportService } from '../services/report.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { ReportsSearchService } from '../services/reports-search.service';
import { Reporte } from '../interfaces/report.interface';
import jsPDF from 'jspdf';
import { ReportsHomeHeaderComponent } from './header/header.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-report-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        RouterModule,
        ReportsHomeHeaderComponent,
        CommonModule
    ]
})

export class ReportsHomeComponent implements OnInit, OnDestroy {
    reportes: Reporte[] = [];
    reportesOriginal: Reporte[] = [];
    isLoading = false;
    private destroy$ = new Subject<void>();
    
    // Modal
    modalAbierto = false;
    tipoModalAbierto: 'equipos' | 'explosivos' | 'materiales' | 'completo' | null = null;
    reporteSeleccionado: Reporte | null = null;

    constructor(
        private reportService: ReportService,
        private alertService: AlertService,
        private router: Router,
        private searchService: ReportsSearchService
    ) {}

    ngOnInit(): void {
        this.cargarReportes();
        this.subscribeToSearch();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Suscribirse a los cambios del servicio de búsqueda
     */
    subscribeToSearch(): void {
        this.searchService.search$
            .pipe(takeUntil(this.destroy$))
            .subscribe(searchTerm => {
                this.filtrarReportes(searchTerm);
            });
    }

    /**
     * Filtrar reportes por término de búsqueda
     */
    filtrarReportes(searchTerm: string): void {
        if (!searchTerm.trim()) {
            this.reportes = [...this.reportesOriginal];
            return;
        }

        const termLower = searchTerm.toLowerCase();
        this.reportes = this.reportesOriginal.filter(reporte => {
            const fechaMatch = this.formatearFecha(reporte.fecha).includes(termLower);
            const turnoMatch = this.obtenerTextoTurno(reporte.turno).toLowerCase().includes(termLower);
            const responsableMatch = (reporte.responsable || '').toLowerCase().includes(termLower);
            const nivelMatch = (reporte.nivel || '').includes(searchTerm);

            return fechaMatch || turnoMatch || responsableMatch || nivelMatch;
        });
    }

    async cargarReportes(): Promise<void> {
        try {
            this.isLoading = true;
            const response = await this.reportService.getReports();
            this.reportesOriginal = response || [];
            this.reportes = [...this.reportesOriginal];
            console.log('Reportes cargados:', this.reportes);
        } catch (error) {
            console.error('Error al cargar reportes:', error);
            this.reportes = [];
            this.reportesOriginal = [];
        } finally {
            this.isLoading = false;
        }
    }  

    // Obtener resumen de reportes mostrados (filtrados)
    get totalReportes(): number {
        return this.reportes.length;
    }

    // Obtener total de equipos en reportes mostrados
    get totalEquipos(): number {
        return this.reportes.reduce((sum, reporte) => sum + (reporte.equipos?.length || 0), 0);
    }

    // Obtener total de explosivos en reportes mostrados
    get totalExplosivos(): number {
        return this.reportes.reduce((sum, reporte) => {
            return sum + (reporte.explosivos?.reduce((subSum, exp) => subSum + exp.consumo, 0) || 0);
        }, 0);
    }

    // Obtener total de materiales en reportes mostrados
    get totalMateriales(): number {
        return this.reportes.reduce((sum, reporte) => {
            return sum + (reporte.materiales?.reduce((subSum, mat) => subSum + mat.consumo, 0) || 0);
        }, 0);
    }

    // Formatear fecha YYYY-MM-DD a DD/MM/YYYY
    formatearFecha(fecha: string): string {
        if (!fecha) return '';
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    }

    // Obtener color del badge de turno
    obtenerColorTurno(turno: string): string {
        return turno === 'DIA' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700';
    }

    // Obtener texto del turno
    obtenerTextoTurno(turno: string): string {
        return turno === 'DIA' ? 'Día' : 'Noche';
    }

    // Obtener color del estado
    obtenerColorEstado(estado: string): string {
        switch (estado) {
            case 'APROBADO':
                return 'bg-emerald-100 text-emerald-700';
            case 'ENVIADO':
                return 'bg-yellow-100 text-yellow-700';
            case 'BORRADOR':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    }

    // Obtener texto del estado
    obtenerTextoEstado(estado: string): string {
        switch (estado) {
            case 'APROBADO':
                return 'APROBADO';
            case 'ENVIADO':
                return 'EN REVISIÓN';
            case 'BORRADOR':
                return 'BORRADOR';
            default:
                return estado;
        }
    }

    // Calcular total de explosivos consumidos en un reporte
    calcularTotalExplosivos(reporte: Reporte): number {
        return reporte.explosivos?.reduce((sum, exp) => sum + (exp.consumo || 0), 0) || 0;
    }

    // Calcular total de materiales consumidos en un reporte
    calcularTotalMateriales(reporte: Reporte): number {
        return reporte.materiales?.reduce((sum, mat) => sum + (mat.consumo || 0), 0) || 0;
    }

    // Abrir modal de detalles
    abrirModalDetalles(tipo: 'equipos' | 'explosivos' | 'materiales' | 'completo', reporte: Reporte): void {
        this.tipoModalAbierto = tipo;
        this.reporteSeleccionado = reporte;
        this.modalAbierto = true;
    }

    // Cerrar modal
    cerrarModal(): void {
        this.modalAbierto = false;
        this.tipoModalAbierto = null;
        this.reporteSeleccionado = null;
    }

    // Obtener título del modal según tipo
    obtenerTituloModal(): string {
        switch (this.tipoModalAbierto) {
            case 'equipos':
                return 'Detalles de Equipos';
            case 'explosivos':
                return 'Detalles de Explosivos';
            case 'materiales':
                return 'Detalles de Materiales';
            default:
                return 'Detalles';
        }
    }

  async generarPDFCompleto(reporte: Reporte): Promise<void> {
  try {
    const doc = new jsPDF('p');

    /* ================= CONFIGURACIÓN GENERAL ================= */
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 10;
    const topMargin = 15;
    const bottomMargin = 15;

    const usableWidth = pageWidth - marginX * 2;

    const rowHeight = 6;
    const headerHeight = 6;

    let yPosition = topMargin;

    const normalizeWidths = (widths: number[]) => {
      const total = widths.reduce((a, b) => a + b, 0);
      const factor = usableWidth / total;
      return widths.map(w => w * factor);
    };

    const needsNewPage = (extraHeight = rowHeight) => {
      return yPosition + extraHeight > pageHeight - bottomMargin;
    };

    /* ================= TÍTULO ================= */
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('REPORTE COMPLETO DE OPERACIONES', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha: ${this.formatearFecha(reporte.fecha)}`, marginX, yPosition);
    yPosition += 6;
    doc.text(`Turno: ${this.obtenerTextoTurno(reporte.turno)}`, marginX, yPosition);
    yPosition += 6;
    doc.text(`Nivel: ${reporte.nivel || '—'}`, marginX, yPosition);
    yPosition += 6;
    doc.text(`Responsable: ${reporte.responsable}`, marginX, yPosition);
    yPosition += 12;

    /* ================= FUNCIONES DE TABLA ================= */
    const drawHeader = (headers: string[], colWidths: number[], color: [number, number, number]) => {
      let xPos = marginX;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);

      headers.forEach((h, i) => {
        doc.setFillColor(...color);
        doc.rect(xPos, yPosition, colWidths[i], headerHeight, 'F');
        doc.text(h, xPos + 1, yPosition + 4, { maxWidth: colWidths[i] - 2 });
        xPos += colWidths[i];
      });

      yPosition += headerHeight;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
    };

    const drawRow = (row: string[], colWidths: number[], bgColor?: [number, number, number]) => {
      let xPos = marginX;

      if (bgColor) {
        doc.setFillColor(...bgColor);
        colWidths.forEach(w => {
          doc.rect(xPos, yPosition, w, rowHeight, 'F');
          xPos += w;
        });
        xPos = marginX;
      }

      doc.setFontSize(8);
      row.forEach((cell, i) => {
        doc.text(cell, xPos + 1, yPosition + 4, {
          maxWidth: colWidths[i] - 2
        });
        xPos += colWidths[i];
      });

      yPosition += rowHeight;
    };

    /* ================= FUNCIÓN SECCIÓN ================= */
    const drawSection = (
      title: string,
      headers: string[],
      colBaseWidths: number[],
      data: string[][],
      headerColor: [number, number, number],
      rowAltColor?: [number, number, number]
    ) => {
      if (needsNewPage(headerHeight + rowHeight)) {
        doc.addPage();
        yPosition = topMargin;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(title, marginX, yPosition);
      yPosition += 7;

      const colWidths = normalizeWidths(colBaseWidths);
      drawHeader(headers, colWidths, headerColor);

      let rowCount = 0;
      data.forEach(row => {
        if (needsNewPage(rowHeight)) {
          doc.addPage();
          yPosition = topMargin;
          drawHeader(headers, colWidths, headerColor);
        }

        drawRow(row, colWidths, rowCount % 2 ? rowAltColor : undefined);
        rowCount++;
      });

      yPosition += 6;
    };

    /* ================= EQUIPOS ================= */
    if (reporte.equipos?.length) {
      drawSection(
        'EQUIPOS',
        ['Equipo', 'Hor. Inicial', 'Hor. Final', 'Horas', 'Comb.', 'Estado', 'Observaciones'],
        [30, 20, 20, 15, 13, 15, 30],
        reporte.equipos.map(e => [
          e.equipoNombre ?? '—',
          e.horometroInicial?.toString() ?? '—',
          e.horometroFinal?.toString() ?? '—',
          e.horasTrabajadas?.toString() ?? '—',
          e.combustibleGalones?.toString() ?? '—',
          e.estado ?? '—',
          e.observacion ?? '—'
        ]),
        [59, 130, 246],
        [240, 244, 255]
      );
    }

    /* ================= EXPLOSIVOS ================= */
    if (reporte.explosivos?.length) {
      drawSection(
        'EXPLOSIVOS',
        ['Explosivo', 'Tipo', 'Stock Ini.', 'Ingreso', 'Consumo', 'Stock Fin.', 'Unidad', 'Obs.'],
        [20, 15, 18, 15, 15, 15, 16, 26],
        reporte.explosivos.map(ex => [
          ex.nombre ?? '—',
          ex.tipo ?? '—',
          ex.stockInicial?.toString() ?? '—',
          ex.ingreso?.toString() ?? '—',
          ex.consumo?.toString() ?? '—',
          ex.stockFinal?.toString() ?? '—',
          ex.unidad ?? '—',
          ex.observacionesOperativas ?? '—'
        ]),
        [249, 115, 22],
        [255, 245, 230]
      );
    }

    /* ================= MATERIALES ================= */
    if (reporte.materiales?.length) {
      drawSection(
        'MATERIALES',
        ['Material', 'Stock Ini.', 'Ingreso', 'Consumo', 'Stock Fin.', 'Unidad', 'Obs.'],
        [20, 18, 15, 15, 15, 12, 30],
        reporte.materiales.map(m => [
          m.materialNombre ?? '—',
          m.stockInicial?.toString() ?? '—',
          m.ingreso?.toString() ?? '—',
          m.consumo?.toString() ?? '—',
          m.stockFinal?.toString() ?? '—',
          m.unidad ?? '—',
          m.observacion ?? '—'
        ]),
        [34, 197, 94],
        [240, 253, 244]
      );
    }

    /* ================= GUARDAR ================= */
    const fecha = this.formatearFecha(reporte.fecha).replace(/\//g, '-');
    doc.save(`Reporte_Completo_${fecha}.pdf`);

    this.alertService.show('PDF generado exitosamente', 'success', 'Éxito');

  } catch (error) {
    console.error(error);
    this.alertService.show('Error al generar el PDF', 'error', 'Error');
  }
}


/**
 * Navegar a la página de edición con el ID del reporte
 */
editarReporte(reporte: Reporte): void {
  if (reporte._id) {
    this.router.navigate(['/dashboard/reports/create'], { queryParams: { _id: reporte._id } });
  } else {
    this.alertService.show('No se puede editar este reporte', 'error', 'Error');
  }
}

}