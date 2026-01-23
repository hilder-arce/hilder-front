import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportService } from '../services/report.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { Reporte } from '../interfaces/report.interface';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-report-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        RouterModule,
        CommonModule
    ]
})

export class ReportsHomeComponent implements OnInit {
    reportes: Reporte[] = [];
    isLoading = false;
    
    // Modal
    modalAbierto = false;
    tipoModalAbierto: 'equipos' | 'explosivos' | 'materiales' | 'completo' | null = null;
    reporteSeleccionado: Reporte | null = null;

    constructor(
        private reportService: ReportService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.cargarReportes();
    }

    async cargarReportes(): Promise<void> {
        try {
            this.isLoading = true;
            const response = await this.reportService.getReports();
            this.reportes = response || [];
            console.log('Reportes cargados:', this.reportes);
        } catch (error) {
            console.error('Error al cargar reportes:', error);
            this.reportes = [];
        } finally {
            this.isLoading = false;
        }
    }  

    // Obtener resumen de reportes totales
    get totalReportes(): number {
        return this.reportes.length;
    }

    // Obtener total de equipos en todos los reportes
    get totalEquipos(): number {
        return this.reportes.reduce((sum, reporte) => sum + (reporte.equipos?.length || 0), 0);
    }

    // Obtener total de explosivos en todos los reportes
    get totalExplosivos(): number {
        return this.reportes.reduce((sum, reporte) => {
            return sum + (reporte.explosivos?.reduce((subSum, exp) => subSum + exp.consumo, 0) || 0);
        }, 0);
    }

    // Obtener total de materiales en todos los reportes
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
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 10;
    const usableWidth = pageWidth - marginX * 2;

    const normalizeWidths = (widths: number[]) => {
      const total = widths.reduce((a, b) => a + b, 0);
      const factor = usableWidth / total;
      return widths.map(w => w * factor);
    };

    let yPosition = 15;

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
    doc.text(`Responsable: ${reporte.responsable}`, marginX, yPosition);
    yPosition += 12;

    /* ================= FUNCIÓN HEADER ================= */
    const drawHeader = (headers: string[], colWidths: number[], color: [number, number, number]) => {
      const headerY = yPosition;
      let xPos = marginX;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);

      for (let i = 0; i < headers.length; i++) {
        doc.setFillColor(...color);
        doc.rect(xPos, headerY, colWidths[i], 6, 'F');
        doc.text(headers[i], xPos + 1, headerY + 4, { maxWidth: colWidths[i] - 2 });
        xPos += colWidths[i];
      }

      yPosition += 6;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
    };

    /* ================= FUNCIÓN FILAS ================= */
    const drawRow = (row: string[], colWidths: number[], bgColor?: [number, number, number]) => {
      let xPos = marginX;

      if (bgColor) {
        doc.setFillColor(...bgColor);
        for (const w of colWidths) {
          doc.rect(xPos, yPosition, w, 6, 'F');
          xPos += w;
        }
        xPos = marginX;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      for (let i = 0; i < row.length; i++) {
        doc.text(row[i], xPos + 1, yPosition + 4, { maxWidth: colWidths[i] - 2 });
        xPos += colWidths[i];
      }

      yPosition += 6;
    };

    /* ================= EQUIPOS ================= */
    if (reporte.equipos?.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('EQUIPOS', marginX, yPosition);
      yPosition += 7;

      const headers = ['Equipo', 'Horómetro Inicial', 'Horómetro Final', 'Horas', 'Combustible', 'Estado', 'Observaciones'];
      let colWidths = normalizeWidths([25, 20, 20, 15, 18, 15, 30]);

      drawHeader(headers, colWidths, [59, 130, 246]);

      let rowCount = 0;
      for (const e of reporte.equipos) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 15;
          drawHeader(headers, colWidths, [59, 130, 246]);
        }

        drawRow([
          e.equipoNombre ?? '—',
          e.horometroInicial?.toString() ?? '—',
          e.horometroFinal?.toString() ?? '—',
          e.horasTrabajadas?.toString() ?? '—',
          e.combustibleGalones?.toString() ?? '—',
          e.estado ?? '—',
          e.observacion ?? '—'
        ], colWidths, rowCount % 2 ? [240, 244, 255] : undefined);

        rowCount++;
      }

      yPosition += 6;
    }

    /* ================= EXPLOSIVOS ================= */
    if (reporte.explosivos?.length) {
      if (yPosition > 170) {
        doc.addPage();
        yPosition = 15;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('EXPLOSIVOS', marginX, yPosition);
      yPosition += 7;

      const headers = ['Explosivo', 'Tipo', 'Stock Inicial', 'Ingreso', 'Consumo', 'Stock Final', 'Unidad', 'Observaciones'];
      let colWidths = normalizeWidths([20, 15, 18, 15, 15, 15, 12, 30]);

      drawHeader(headers, colWidths, [249, 115, 22]);

      let rowCount = 0;
      for (const ex of reporte.explosivos) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 15;
          drawHeader(headers, colWidths, [249, 115, 22]);
        }

        drawRow([
          ex.nombre ?? '—',
          ex.tipo ?? '—',
          ex.stockInicial?.toString() ?? '—',
          ex.ingreso?.toString() ?? '—',
          ex.consumo?.toString() ?? '—',
          ex.stockFinal?.toString() ?? '—',
          ex.unidad ?? '—',
          ex.observacionesOperativas ?? '—'
        ], colWidths, rowCount % 2 ? [255, 245, 230] : undefined);

        rowCount++;
      }

      yPosition += 6;
    }

    /* ================= MATERIALES ================= */
    if (reporte.materiales?.length) {
      if (yPosition > 170) {
        doc.addPage();
        yPosition = 15;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('MATERIALES', marginX, yPosition);
      yPosition += 7;

      const headers = ['Material', 'Stock Inicial', 'Ingreso', 'Consumo', 'Stock Final', 'Unidad', 'Observaciones'];
      let colWidths = normalizeWidths([20, 18, 15, 15, 15, 12, 30]);

      drawHeader(headers, colWidths, [34, 197, 94]);

      let rowCount = 0;
      for (const m of reporte.materiales) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 15;
          drawHeader(headers, colWidths, [34, 197, 94]);
        }

        drawRow([
          m.materialNombre ?? '—',
          m.stockInicial?.toString() ?? '—',
          m.ingreso?.toString() ?? '—',
          m.consumo?.toString() ?? '—',
          m.stockFinal?.toString() ?? '—',
          m.unidad ?? '—',
          m.observacion ?? '—'
        ], colWidths, rowCount % 2 ? [240, 253, 244] : undefined);

        rowCount++;
      }
    }

    const fecha = this.formatearFecha(reporte.fecha).replace(/\//g, '-');
    doc.save(`Reporte_Completo_${fecha}.pdf`);
    this.alertService.show('PDF generado exitosamente', 'success', 'Éxito');

  } catch (error) {
    console.error(error);
    this.alertService.show('Error al generar el PDF', 'error', 'Error');
  }
}

}