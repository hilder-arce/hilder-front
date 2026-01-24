import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { EquipoReportService } from "../services/equipo.service";
import { Equipo } from "../../../../config/components/equipos/interfaces/equipo.interface";
import { ReporteEquipo } from "../interfaces/equipo.interface";
import { EquipoService } from "../../../../config/components/equipos/services/equipo.service";
import { ReportsSearchService } from "../../../services/reports-search.service";

@Component({
    selector: 'app-create-equipo',
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ]
})

export class CreateEquipoComponent implements  OnInit {
    
    // INYECTAR SERVICIOS
    private searchService = inject(ReportsSearchService);

    constructor(
        private alertService: AlertService,
        private router: Router,
        private equipoService: EquipoService,
        private equipoReportService: EquipoReportService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Cargar equipos disponibles del servicio de config
        this.cargarEquiposDisponibles();
        // Cargar reportes guardados en localStorage
        this.cargarReportesAlmacenados();
        // Escuchar cambios de búsqueda
        this.searchService.search$.subscribe(searchTerm => {
            this.filtrarEquipos(searchTerm);
        });
    }

    // PROPIEDADES 
    equipos: Equipo[] = [];
    reporteEquipos: ReporteEquipo[] = [];
    reporteEquiposOriginal: ReporteEquipo[] = []; // Para guardar los datos sin filtrar
    equiposFiltrados: ReporteEquipo[] = [];
    editingRows = new Set<number>();
    savedRows = new Set<number>();
    originalRow: Map<number, ReporteEquipo> = new Map(); // Para restaurar si cancela edición

    /**
     * Filtrar equipos según la búsqueda
     */
    filtrarEquipos(searchTerm: string): void {
        if (!searchTerm.trim()) {
            this.reporteEquipos = [...this.reporteEquiposOriginal];
        } else {
            this.reporteEquipos = this.reporteEquiposOriginal.filter(equipo =>
                equipo.equipoNombre?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    }

    /**
     * Cargar los equipos disponibles del servicio de config
     */
    async cargarEquiposDisponibles() {
        try {
            const equipos = await this.equipoService.getEquipos();
            if (equipos) {
                this.equipos = [...equipos];
            }
        } catch (error) {
            console.error('Error al cargar equipos:', error);
        }
    }

    /**
     * Cargar los reportes guardados en localStorage
     */
    cargarReportesAlmacenados() {
        const reportes = this.equipoReportService.obtenerEquipos();
        this.reporteEquipos = [...reportes];
        this.reporteEquiposOriginal = [...reportes]; // Guardar original para filtrado
        // Marcar todos los reportes cargados como guardados
        reportes.forEach((_, index) => {
            this.savedRows.add(index);
        });
    }

    /**
     * Agregar una nueva fila para editar
     */
    addEquipoRow() {
        const nuevoReporte: ReporteEquipo = {
            equipoId: '',
            equipoNombre: '',
            horometroInicial: 0,
            horometroFinal: 0,
            horasTrabajadas: 0,
            combustibleGalones: 0,
            estado: 'OPERATIVO',
            observacion: ''
        };
        
        this.reporteEquipos.push(nuevoReporte);
        const index = this.reporteEquipos.length - 1;
        this.editingRows.add(index);
    }

    /**
     * Calcular horas trabajadas
     */
    calcularHoras(row: ReporteEquipo) {
        if (row.horometroFinal >= row.horometroInicial) {
            row.horasTrabajadas = Number(
                (row.horometroFinal - row.horometroInicial).toFixed(1)
            );
        } else {
            row.horasTrabajadas = 0;
        }
    }

    /**
     * Manejar cambio de equipo - Obtener nombre del equipo seleccionado
     */
    onEquipoChange(row: ReporteEquipo) {
        const equipoSeleccionado = this.equipos.find(e => e._id === row.equipoId);
        if (equipoSeleccionado) {
            row.equipoNombre = equipoSeleccionado.nombre;
        }
    }

    /**
     * Verificar si una fila está en modo edición
     */
    isEditing(i: number): boolean {
        return this.editingRows.has(i);
    }

    /**
     * Verificar si una fila ha sido guardada
     */
    isSaved(i: number): boolean {
        return this.savedRows.has(i);
    }

    /**
     * Guardar una fila individual
     */
    saveRow(i: number) {
        const row = this.reporteEquipos[i];
        const esNuevo = !this.isSaved(i);
        const esActualizacion = !esNuevo;

        // Validar que se seleccione un equipo
        if (!row.equipoId || !row.equipoNombre) {
            this.alertService.show('Debes seleccionar un equipo', 'error');
            return;
        }

        // Validar que el horómetro inicial sea menor que el final
        if (row.horometroInicial >= row.horometroFinal) {
            this.alertService.show('El horómetro inicial debe ser menor que el horómetro final', 'error');
            return;
        }

        // Validar que los horómetros sean válidos (no negativos)
        if (row.horometroInicial < 0 || row.horometroFinal < 0) {
            this.alertService.show('Los horómetros no pueden ser negativos', 'error');
            return;
        }

        // Si es una actualización, verificar que hay cambios
        if (esActualizacion) {
            const original = this.originalRow.get(i);
            if (original) {
                const hayNoChanges = 
                    original.equipoId === row.equipoId &&
                    original.horometroInicial === row.horometroInicial &&
                    original.horometroFinal === row.horometroFinal &&
                    original.combustibleGalones === row.combustibleGalones &&
                    original.estado === row.estado &&
                    original.observacion === row.observacion;

                if (hayNoChanges) {
                    this.alertService.show('No hay cambios que guardar', 'warning');
                    return;
                }
            }
        }

        // Intentar guardar en localStorage
        const equipoExistente = this.equipoReportService.obtenerEquipoPorId(row.equipoId);
        
        let exito = false;
        if (equipoExistente) {
            exito = this.equipoReportService.actualizarEquipo(row.equipoId, row);
        } else {
            exito = this.equipoReportService.crearEquipo(row);
        }

        if (exito) {
            const mensaje = esActualizacion 
                ? 'Equipo actualizado correctamente' 
                : 'Equipo guardado correctamente';
            this.alertService.show(mensaje, 'success');
            this.editingRows.delete(i);
            this.savedRows.add(i);
            this.originalRow.delete(i); // Limpiar copia original
        } else {
            this.alertService.show('Error al guardar el reporte', 'error');
        }
    }

    /**
     * Editar una fila guardada
     */
    editRow(i: number) {
        // Guardar copia original para poder revertir si es necesario
        this.originalRow.set(i, JSON.parse(JSON.stringify(this.reporteEquipos[i])));
        this.editingRows.add(i);
    }

    /**
     * Eliminar una fila
     */
    async removeEquipoRow(i: number) {
        const row = this.reporteEquipos[i];
        
        // Mostrar alerta de confirmación
        const confirmado = await this.alertService.confirm(
            '¿Estás seguro de que deseas eliminar este reporte?',
            {
                title: 'Eliminar reporte',
                confirmText: 'Eliminar',
                cancelText: 'Cancelar',
                danger: true
            }
        );

        if (!confirmado) {
            return;
        }

        // Si ya fue guardado, eliminar del localStorage
        if (this.savedRows.has(i) && row.equipoId) {
            const exito = this.equipoReportService.eliminarEquipo(row.equipoId);
            if (!exito) {
                this.alertService.show('Error al eliminar el reporte', 'error');
                return;
            }
        }

        // Remover del array
        this.reporteEquipos.splice(i, 1);
        this.editingRows.delete(i);
        this.savedRows.delete(i);
        this.originalRow.delete(i); // Limpiar copia original
        
        this.alertService.show('Reporte eliminado', 'success');
    }

    /**
     * Guardar todos los reportes
     */
    guardarTodos() {
        let errores = 0;
        
        this.reporteEquipos.forEach((row, index) => {
            if (!this.isSaved(index)) {
                const equipoExistente = this.equipoReportService.obtenerEquipoPorId(row.equipoId);
                const exito = equipoExistente 
                    ? this.equipoReportService.actualizarEquipo(row.equipoId, row)
                    : this.equipoReportService.crearEquipo(row);
                
                if (exito) {
                    this.savedRows.add(index);
                    this.editingRows.delete(index);
                } else {
                    errores++;
                }
            }
        });

        if (errores === 0) {
            this.alertService.show('Todos los reportes han sido guardados', 'success');
        } else {
            this.alertService.show(`${errores} reportes fallaron al guardar`, 'error');
        }
    }
}
