import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
        FormsModule,
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
        private router: Router,
        private route: ActivatedRoute
    ) { }


    fechaActual!: string;
    agente = 'Hilder Arce'
    nivelSeleccionado: '2750' | '2360' | '' = '';
    isLoading = false;
    isEditing = false;
    reporteId: string | null = null;
    reporteOriginal: Reporte | null = null; // Guardar estado inicial para detectar cambios

    ngOnInit(): void {
        this.fechaActual = this.obtenerFecha();
        
        // Verificar si hay un parámetro _id para edición
        this.route.queryParams.subscribe(params => {
            if (params['_id']) {
                this.reporteId = params['_id'];
                this.isEditing = true;
                this.cargarReporteParaEdicion(params['_id']);
            }
        });
    }

    /**
     * Cargar un reporte existente para edición
     */
    async cargarReporteParaEdicion(reporteId: string): Promise<void> {
        try {
            this.isLoading = true;
            const reporte = await this.reportService.getReportById(reporteId);
            if (reporte) {
                this.llenarFormularioConReporte(reporte);
            } else {
                this.alertService.show('Reporte no encontrado', 'warning', 'Advertencia');
                this.router.navigate(['/dashboard/reports']);
            }
            this.isLoading = false;
        } catch (error) {
            console.error('Error al cargar reporte:', error);
            this.alertService.show('Error al cargar el reporte para edición', 'error', 'Error');
            this.isLoading = false;
            this.router.navigate(['/dashboard/reports']);
        }
    }

    /**
     * Llenar el formulario con los datos del reporte
     */
    private llenarFormularioConReporte(reporte: Reporte): void {
        try {
            // Guardar estado original para detectar cambios
            this.reporteOriginal = JSON.parse(JSON.stringify(reporte));

            // Actualizar fecha
            if (reporte.fecha) {
                this.fechaActual = reporte.fecha;
            }

            // Actualizar turno si existe
            if (reporte.turno) {
                setTimeout(() => {
                    const turnoSelect = document.querySelector('select') as HTMLSelectElement;
                    if (turnoSelect) {
                        turnoSelect.value = reporte.turno.toLowerCase();
                    }
                }, 100);
            }

            // Actualizar nivel si existe
            if (reporte.nivel) {
                this.nivelSeleccionado = reporte.nivel;
            }

            // Cargar equipos en el componente hijo
            if (this.equipoComponent && reporte.equipos && reporte.equipos.length > 0) {
                this.equipoComponent.reporteEquipos = JSON.parse(JSON.stringify(reporte.equipos));
                // Marcar todos los equipos como guardados
                setTimeout(() => {
                    for (let i = 0; i < this.equipoComponent.reporteEquipos.length; i++) {
                        this.equipoComponent.savedRows.add(i);
                    }
                }, 150);
            }

            // Cargar explosivos en el componente hijo
            if (this.explosivoComponent && reporte.explosivos && reporte.explosivos.length > 0) {
                this.explosivoComponent.reporteExplosivos = JSON.parse(JSON.stringify(reporte.explosivos));
                // Marcar todos los explosivos como guardados
                setTimeout(() => {
                    for (let i = 0; i < this.explosivoComponent.reporteExplosivos.length; i++) {
                        this.explosivoComponent.savedRows.add(i);
                    }
                }, 150);
            }

            // Cargar materiales en el componente hijo
            if (this.materialComponent && reporte.materiales && reporte.materiales.length > 0) {
                this.materialComponent.reporteMateriales = JSON.parse(JSON.stringify(reporte.materiales));
                // Marcar todos los materiales como guardados
                setTimeout(() => {
                    for (let i = 0; i < this.materialComponent.reporteMateriales.length; i++) {
                        this.materialComponent.savedRows.add(i);
                    }
                }, 150);
            }

            console.log('Reporte cargado para edición:', reporte);
        } catch (error) {
            console.error('Error al llenar formulario:', error);
            this.alertService.show('Error al cargar los datos del reporte', 'error', 'Error');
        }
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
            return;
        }

        try {
            this.isLoading = true;
            const reportData = this.getReportData();
            console.log('Saving report:', reportData);
            
            let response;
            if (this.isEditing && this.reporteId) {
                // Actualizar reporte existente
                response = await this.reportService.updateReport(this.reporteId, reportData);
                this.alertService.show(
                    'Reporte actualizado exitosamente',
                    'success',
                    'Éxito'
                );
            } else {
                // Crear nuevo reporte
                response = await this.reportService.saveReport(reportData);
                this.alertService.show(
                    'Reporte guardado exitosamente',
                    'success',
                    'Éxito'
                );
            }
            
            this.isLoading = false;
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
            nivel: this.nivelSeleccionado as '2750' | '2360' | undefined,
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
        // Si estamos editando, validar que haya cambios
        if (this.isEditing && !this.hasChanges()) {
            this.alertService.show('No hay cambios para guardar', 'info', 'Información');
            return false;
        }

        const turno = this.getTurnoValue();
        
        // Validar fecha
        if (!this.fechaActual) {
            this.alertService.show('Por favor selecciona una fecha', 'warning', 'Validación');
            return false;
        }

        // Validar turno
        if (!turno) {
            this.alertService.show('Por favor selecciona un turno (Día o Noche)', 'warning', 'Validación');
            return false;
        }

        // Validar nivel
        if (!this.nivelSeleccionado) {
            this.alertService.show('Por favor selecciona un nivel (2750 o 2360)', 'warning', 'Validación');
            return false;
        }

        // Validar que haya al menos un equipo registrado
        const equipos = this.equipoComponent?.reporteEquipos || [];
        if (equipos.length === 0) {
            this.alertService.show('Debes registrar al menos un equipo', 'warning', 'Validación');
            return false;
        }

        // Validar que haya al menos un explosivo registrado
        const explosivos = this.explosivoComponent?.reporteExplosivos || [];
        if (explosivos.length === 0) {
            this.alertService.show('Debes registrar al menos un explosivo', 'warning', 'Validación');
            return false;
        }

        // Validar que haya al menos un material registrado
        const materiales = this.materialComponent?.reporteMateriales || [];
        if (materiales.length === 0) {
            this.alertService.show('Debes registrar al menos un material', 'warning', 'Validación');
            return false;
        }

        return true;
    }

    /**
     * Verificar si hay cambios sin guardar
     */
    private hasChanges(): boolean {
        if (!this.isEditing) {
            // Si no estamos editando, siempre hay cambios (para pedir confirmación)
            return true;
        }

        // Comparar con el estado original
        if (!this.reporteOriginal) {
            return true;
        }

        const reportActual = this.getReportData();

        // Comparar fecha
        if (reportActual.fecha !== this.reporteOriginal.fecha) {
            return true;
        }

        // Comparar turno
        if (reportActual.turno !== this.reporteOriginal.turno) {
            return true;
        }

        // Comparar nivel
        if (reportActual.nivel !== this.reporteOriginal.nivel) {
            return true;
        }

        // Comparar equipos (contenido completo, no solo cantidad)
        if (!this.arraysAreEqual(reportActual.equipos || [], this.reporteOriginal.equipos || [])) {
            return true;
        }

        // Comparar explosivos (contenido completo, no solo cantidad)
        if (!this.arraysAreEqual(reportActual.explosivos || [], this.reporteOriginal.explosivos || [])) {
            return true;
        }

        // Comparar materiales (contenido completo, no solo cantidad)
        if (!this.arraysAreEqual(reportActual.materiales || [], this.reporteOriginal.materiales || [])) {
            return true;
        }

        return false;
    }

    /**
     * Comparar dos arrays profundamente
     */
    private arraysAreEqual(arr1: any[], arr2: any[]): boolean {
        if (arr1.length !== arr2.length) {
            return false;
        }

        return arr1.every((item, index) => {
            return JSON.stringify(item) === JSON.stringify(arr2[index]);
        });
    }

    /**
     * Obtener valor del turno (helper)
     */
    private getTurnoValue(): string {
        const turnoSelect = document.querySelector('select') as HTMLSelectElement;
        return turnoSelect?.value || '';
    }

}