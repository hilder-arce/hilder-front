import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../users/services/auth.service';
import { ReportService } from '../services/report.service';
import { Reporte } from '../interfaces/report.interface';
import { AlertService } from '../../../../shared/services/alert.service';
import { CreateEquipoComponent } from '../components/equipos/create/create.component';
import { CreateExplosivoComponent } from '../components/explosivos/create/create.component';
import { CreateMaterialComponent } from '../components/materials/create/create.component';

@Component({
    selector: 'app-report-create',
    templateUrl: './report-create.component.html',
    styleUrl: './report-create.component.css',
    imports: [
        CommonModule,
        CreateEquipoComponent,
        CreateExplosivoComponent,
        CreateMaterialComponent
    ]
})

export class ReportCreateComponent implements OnInit {

    @ViewChild(CreateEquipoComponent) equipoComponent!: CreateEquipoComponent;
    @ViewChild(CreateExplosivoComponent) explosivoComponent!: CreateExplosivoComponent;
    @ViewChild(CreateMaterialComponent) materialComponent!: CreateMaterialComponent;

    constructor(
        public auth: AuthService,
        private reportService: ReportService,
        private alertService: AlertService,
        private router: Router
    ) { }


    fechaActual!: string;
    agente = 'Hilder Arce'
    isLoading = false;

    ngOnInit(): void {
        this.fechaActual = this.obtenerFecha();
    }

    private obtenerFecha() {
        const hoy = new Date();

        const year = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');

        return `${year}-${mes}-${dia}`;
    }

    /**
     * Guardar reporte definitivamente
     */
    async saveReport(): Promise<void> {
        if (!this.validateForm()) {
            this.alertService.show(
                'Por favor completa todos los campos requeridos',
                'warning',
                'Validación'
            );
            return;
        }

        try {
            this.isLoading = true;
            const reportData = this.getReportData();
            console.log('Saving report:', reportData);
            const response = await this.reportService.saveReport(reportData);
            
            this.isLoading = false;
            this.alertService.show(
                'Reporte guardado exitosamente',
                'success',
                'Éxito'
            );
            this.router.navigate(['/dashboard/reports']);
        } catch (error: any) {
            this.isLoading = false;
            this.alertService.show(
                'Error al guardar el reporte. Intenta nuevamente.',
                'error',
                'Error'
            );
            console.error('Error al guardar reporte:', error);
        }
    }

    /**
     * Guardar reporte en borrador
     */
    async saveDraft(): Promise<void> {
        try {
            this.isLoading = true;
            const reportData = this.getReportData();
            const response = await this.reportService.saveDraft(reportData);
            
            this.isLoading = false;
            this.alertService.show(
                'Reporte guardado en borrador',
                'success',
                'Borrador guardado'
            );
            this.router.navigate(['/dashboard/reports']);
        } catch (error: any) {
            this.isLoading = false;
            this.alertService.show(
                'Error al guardar el borrador. Intenta nuevamente.',
                'error',
                'Error'
            );
            console.error('Error al guardar borrador:', error);
        }
    }

    /**
     * Cancelar y volver
     */
    cancel(): void {
        if (this.hasChanges()) {
            const confirmed = window.confirm('¿Deseas descartar los cambios?');
            if (!confirmed) return;
        }
        this.router.navigate(['/dashboard/reports']);
    }

    /**
     * Obtener datos del formulario
     */
    private getReportData(): Reporte {
        return {
            fecha: this.fechaActual,
            turno: this.getTurnoValue().toUpperCase() as 'DIA' | 'NOCHE',
            responsable: this.auth.currentUser?.nameUser || this.agente,
            equipos: this.equipoComponent?.reporteEquipos || [],
            explosivos: this.explosivoComponent?.reporteExplosivos || [],
            materiales: this.materialComponent?.reporteMateriales || [],
            observacionesGenerales: '',
            estado: 'BORRADOR'
        };
    }

    /**
     * Validar que el formulario tenga datos requeridos
     */
    private validateForm(): boolean {
        // Aquí puedes implementar validaciones específicas
        // Por ahora verifica que haya una fecha y turno
        const turno = this.getTurnoValue();
        return !!this.fechaActual && !!turno;
    }

    /**
     * Verificar si hay cambios sin guardar
     */
    private hasChanges(): boolean {
        // Implementar lógica para detectar cambios
        // Por ahora retorna true siempre para pedirle confirmación
        return true;
    }

    /**
     * Obtener valor del turno (helper)
     */
    private getTurnoValue(): string {
        const turnoSelect = document.querySelector('select') as HTMLSelectElement;
        return turnoSelect?.value || '';
    }

}