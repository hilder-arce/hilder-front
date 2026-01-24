import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { Reporte } from "../../../interfaces/report.interface";
import { ReporteEquipo } from "../interfaces/equipo.interface";
import { ReportService } from "../../../services/report.service";
import { ReportsSearchService } from "../../../services/reports-search.service";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'app-list-equipos',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    imports: [
        CommonModule,
        RouterModule
    ]
})

export class ListEquiposComponent implements OnInit, OnDestroy {
    reportes: Reporte[] = [];
    reportesOriginal: Reporte[] = [];
    isLoading = false;
    private destroy$ = new Subject<void>();
    private searchService = inject(ReportsSearchService);
    
    // Modal
    modalAbierto = false;
    reporteSeleccionado: Reporte | null = null;

    //INJECTAR SERVICIOS
    constructor(
        private router: Router,
        private alertService: AlertService,
        private reportService: ReportService,
    ) { }

    //INICIALIZAR COMPONENTE
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
            const turnoMatch = reporte.turno.toLowerCase().includes(termLower);
            const responsableMatch = (reporte.responsable || '').toLowerCase().includes(termLower);
            const nivelMatch = (reporte.nivel || '').includes(searchTerm);

            return fechaMatch || turnoMatch || responsableMatch || nivelMatch;
        });
    }

    //CARGAR LISTA DE REPORTES DE EQUIPOS
    async cargarReportes(): Promise<void> {
        try {
            this.isLoading = true;
            const res = await this.reportService.getReports();
            this.reportesOriginal = res || [];
            this.reportes = [...this.reportesOriginal];
            console.log('Reportes cargados:', this.reportes);
        } catch (error) {
            console.error('Error al cargar reportes:', error);
            this.alertService.show(
                'Error al cargar los reportes de equipos',
                'error',
                'Error'
            );
        } finally {
            this.isLoading = false;
        }
    }

    //OBTENER CANTIDAD DE EQUIPOS DE UN REPORTE
    obtenerCantidadEquipos(reporte: Reporte): number {
        return reporte?.equipos?.length || 0;
    }

    //OBTENER TOTAL DE EQUIPOS OPERATIVOS
    obtenerEquiposOperativos(reporte: Reporte): number {
        return reporte?.equipos?.filter(e => e.estado === 'OPERATIVO').length || 0;
    }

    //OBTENER TOTAL DE EQUIPOS EN MANTENIMIENTO
    obtenerEquiposMantenimiento(reporte: Reporte): number {
        return reporte?.equipos?.filter(e => e.estado === 'MANTENIMIENTO').length || 0;
    }

    //OBTENER TOTAL DE HORAS TRABAJADAS
    obtenerTotalHoras(reporte: Reporte): number {
        return reporte?.equipos?.reduce((sum, e) => sum + (e.horasTrabajadas || 0), 0) || 0;
    }

    //OBTENER TOTAL DE COMBUSTIBLE
    obtenerTotalCombustible(reporte: Reporte): number {
        return reporte?.equipos?.reduce((sum, e) => sum + (e.combustibleGalones || 0), 0) || 0;
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

    // OBTENER COLOR DEL ESTADO DE EQUIPO
    obtenerColorEstadoEquipo(estado: string): string {
        return estado === 'OPERATIVO' ? 'text-emerald-600' : 'text-orange-600';
    }

    // GENERAR PDF DE EQUIPOS
    async generarPDFEquipos(reporte: Reporte): Promise<void> {
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
            doc.text('REPORTE DE EQUIPOS', pageWidth / 2, yPosition, { align: 'center' });

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

            // Tabla de equipos
            if (reporte.equipos && reporte.equipos.length > 0) {
                const headers = ['Equipo', 'Horómetro Inicial', 'Horómetro Final', 'Horas', 'Combustible', 'Estado', 'Observaciones'];
                let colWidths = normalizeWidths([25, 20, 20, 15, 18, 15, 30]);

                drawHeader(headers, colWidths, [59, 130, 246]);

                let rowCount = 0;
                for (const equipo of reporte.equipos) {
                    if (yPosition > 180) {
                        doc.addPage();
                        yPosition = 15;
                        drawHeader(headers, colWidths, [59, 130, 246]);
                    }

                    const row = [
                        equipo.equipoNombre || '—',
                        equipo.horometroInicial?.toString() || '—',
                        equipo.horometroFinal?.toString() || '—',
                        equipo.horasTrabajadas?.toString() || '—',
                        equipo.combustibleGalones?.toString() || '—',
                        equipo.estado || '—',
                        equipo.observacion || '—'
                    ];

                    drawRow(row, colWidths, rowCount % 2 ? [240, 244, 255] : undefined);
                    rowCount++;
                }
            }

            // Guardar PDF
            const fecha = this.formatearFecha(reporte.fecha).replace(/\//g, '-');
            doc.save(`Equipos_${fecha}.pdf`);
            this.alertService.show('PDF generado exitosamente', 'success', 'Éxito');
        } catch (error) {
            console.error('Error al generar PDF:', error);
            this.alertService.show('Error al generar el PDF', 'error', 'Error');
        }
    }
}