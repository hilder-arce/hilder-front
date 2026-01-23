import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { FormsModule } from "@angular/forms";
import { Reporte } from "../../../interfaces/report.interface";
import { ReporteMaterial } from "../interfaces/material.interface";
import { ReportService } from "../../../services/report.service";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-list-material',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class ListMaterialComponent implements OnInit {
  reportes: Reporte[] = [];
  isLoading = false;
  
  // Modal
  modalAbierto = false;
  reporteSeleccionado: Reporte | null = null;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.cargarReportes();
  }

  //CARGAR LISTA DE REPORTES DE MATERIALES
  async cargarReportes(): Promise<void> {
    try {
      this.isLoading = true;
      const res = await this.reportService.getReports();
      this.reportes = res || [];
      console.log('Reportes cargados:', this.reportes);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      this.alertService.show(
        'Error al cargar los reportes de materiales',
        'error',
        'Error'
      );
    } finally {
      this.isLoading = false;
    }
  }

  //OBTENER CANTIDAD DE MATERIALES DE UN REPORTE
  obtenerCantidadMateriales(reporte: Reporte): number {
    return reporte?.materiales?.length || 0;
  }

  //OBTENER TOTAL DE ITEMS DE MATERIALES
  obtenerTotalItems(reporte: Reporte): number {
    return reporte?.materiales?.reduce((sum, m) => sum + (m.ingreso || 0), 0) || 0;
  }

  //OBTENER TOTAL DE CRÍTICOS (MATERIALES CON CONSUMO ALTO)
  obtenerTotalCriticos(reporte: Reporte): number {
    return reporte?.materiales?.filter(m => (m.consumo || 0) > 50).length || 0;
  }

  //OBTENER MATERIAL PRINCIPAL
  obtenerMaterialPrincipal(reporte: Reporte): string {
    return reporte?.materiales?.[0]?.materialNombre || 'Sin materiales';
  }

  //FORMATEAR FECHA
  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  //OBTENER TEXTO DEL ESTADO
  obtenerTextoEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'BORRADOR': 'BORRADOR',
      'ENVIADO': 'ENVIADO',
      'APROBADO': 'APROBADO'
    };
    return estados[estado] || estado;
  }

  //OBTENER COLOR DEL ESTADO
  obtenerColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      'BORRADOR': 'bg-slate-100 text-slate-700',
      'ENVIADO': 'bg-yellow-100 text-yellow-700',
      'APROBADO': 'bg-emerald-100 text-emerald-700'
    };
    return colores[estado] || 'bg-slate-100 text-slate-700';
  }

  // ABRIR MODAL DE DETALLES
  abrirModal(reporte: Reporte): void {
    this.reporteSeleccionado = reporte;
    this.modalAbierto = true;
  }

  // CERRAR MODAL
  cerrarModal(): void {
    this.modalAbierto = false;
    this.reporteSeleccionado = null;
  }

  // GENERAR PDF DE MATERIALES
  async generarPDFMateriales(reporte: Reporte): Promise<void> {
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

      // Título
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('REPORTE DE MATERIALES', pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Fecha: ${this.formatearFecha(reporte.fecha)}`, marginX, yPosition);
      yPosition += 6;
      doc.text(`Turno: ${reporte.turno}`, marginX, yPosition);
      yPosition += 6;
      doc.text(`Responsable: ${reporte.responsable}`, marginX, yPosition);
      yPosition += 12;

      // Función para dibujar headers
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

      // Función para dibujar filas
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

      // Tabla de materiales
      if (reporte.materiales && reporte.materiales.length > 0) {
        const headers = ['Material', 'Stock Inicial', 'Ingreso', 'Consumo', 'Stock Final', 'Unidad', 'Observaciones'];
        let colWidths = normalizeWidths([20, 18, 15, 15, 15, 12, 30]);

        drawHeader(headers, colWidths, [34, 197, 94]);

        let rowCount = 0;
        for (const material of reporte.materiales) {
          if (yPosition > 180) {
            doc.addPage();
            yPosition = 15;
            drawHeader(headers, colWidths, [34, 197, 94]);
          }

          const row = [
            material.materialNombre || '—',
            material.stockInicial?.toString() || '—',
            material.ingreso?.toString() || '—',
            material.consumo?.toString() || '—',
            material.stockFinal?.toString() || '—',
            material.unidad || '—',
            material.observacion || '—'
          ];

          drawRow(row, colWidths, rowCount % 2 ? [240, 253, 244] : undefined);
          rowCount++;
        }
      }

      // Guardar PDF
      const fecha = this.formatearFecha(reporte.fecha).replace(/\//g, '-');
      doc.save(`Materiales_${fecha}.pdf`);
      this.alertService.show('PDF generado exitosamente', 'success', 'Éxito');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.alertService.show('Error al generar el PDF', 'error', 'Error');
    }
  }

}
