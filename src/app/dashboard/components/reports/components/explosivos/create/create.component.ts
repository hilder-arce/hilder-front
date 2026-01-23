import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { Explosivo } from "../../../../config/components/explosivos/interfaces/explosivo.interface";
import { ExplosivoService } from "../../../../config/components/explosivos/services/explosivo.service";
import { ReporteExplosivo, TipoExplosivo, UnidadMedidaExplosivo } from "../interfaces/explosivo.interface";
import { ExplosivoReportService } from "../services/explosivo-report.service";

@Component({
    selector: 'app-create-explosivo',
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ]
})

export class CreateExplosivoComponent implements OnInit {

    constructor(
        private alertService: AlertService,
        private router: Router,
        private explosivoService: ExplosivoService,
        private explosivoReportService: ExplosivoReportService,
        private route: ActivatedRoute
      ){}

    ngOnInit(): void {
        // Cargar explosivos disponibles del servicio de config
        this.cargarExplosivosDisponibles();
        // Cargar reportes guardados en localStorage
        this.cargarReportesAlmacenados();
    }

    explosivos: Explosivo[] = [];
    reporteExplosivos: ReporteExplosivo[] = [];
    editingRows = new Set<number>();
    savedRows = new Set<number>();
    originalRow: Map<number, ReporteExplosivo> = new Map(); // Para restaurar si cancela edición

    /**
     * Cargar los explosivos disponibles del servicio de config
     */
    async cargarExplosivosDisponibles() {
        try {
            const explosivos = await this.explosivoService.getExplosivos();
            if (explosivos) {
                this.explosivos = [...explosivos];
            }
        } catch (error) {
        }
    }

    /**
     * Cargar los reportes guardados en localStorage
     */
    cargarReportesAlmacenados() {
        const reportes = this.explosivoReportService.obtenerExplosivos();
        this.reporteExplosivos = [...reportes];
        // Marcar todos los reportes cargados como guardados
        reportes.forEach((_, index) => {
            this.savedRows.add(index);
        });
    }

    /**
     * Agregar una nueva fila para editar
     */
    addExplosivoRow() {
        const nuevoReporte: ReporteExplosivo = {
            explosivoId: '',
            nombre: '',
            tipo: 'EMULSION' as TipoExplosivo,
            stockInicial: 0,
            ingreso: 0,
            consumo: 0,
            stockFinal: 0,
            unidad: 'KILOGRAMOS' as UnidadMedidaExplosivo,
            observacionesOperativas: ''
        };
        
        this.reporteExplosivos.push(nuevoReporte);
        const index = this.reporteExplosivos.length - 1;
        this.editingRows.add(index);
    }

    /**
     * Calcular stock final
     */
    calcularStock(row: ReporteExplosivo) {
        const final = row.stockInicial + Number(row.ingreso || 0) - Number(row.consumo || 0);
        row.stockFinal = final >= 0 ? final : 0;
    }

    /**
     * Manejar cambio de explosivo - Obtener nombre, tipo y unidad del explosivo seleccionado
     */
    onExplosivoChange(row: ReporteExplosivo) {
        const ex = this.explosivos.find(e => e._id === row.explosivoId);
        if (!ex) return;

        row.nombre = ex.nombre;
        row.tipo = ex.tipo;
        row.unidad = ex.unidadMedida;

        this.calcularStock(row);
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
    saveExplosivoRow(i: number) {
        const row = this.reporteExplosivos[i];
        const esNuevo = !this.isSaved(i);
        const esActualizacion = !esNuevo;

        // Validar que se seleccione un explosivo
        if (!row.explosivoId || !row.nombre) {
            this.alertService.show('Debes seleccionar un explosivo', 'error');
            return;
        }

        // Validar que los valores sean válidos (no negativos)
        if (row.stockInicial < 0 || row.ingreso < 0 || row.consumo < 0) {
            this.alertService.show('Los valores no pueden ser negativos', 'error');
            return;
        }

        // Validar que el consumo no supere al stock disponible (stock inicial + ingreso)
        const stockDisponible = row.stockInicial + row.ingreso;
        if (row.consumo > stockDisponible) {
            this.alertService.show('El consumo no puede superar el stock disponible', 'error');
            return;
        }

        // Si es una actualización, verificar que hay cambios
        if (esActualizacion) {
            const original = this.originalRow.get(i);
            if (original) {
                const hayNoChanges = 
                    original.explosivoId === row.explosivoId &&
                    original.stockInicial === row.stockInicial &&
                    original.ingreso === row.ingreso &&
                    original.consumo === row.consumo &&
                    original.observacionesOperativas === row.observacionesOperativas;

                if (hayNoChanges) {
                    this.alertService.show('No hay cambios que guardar', 'warning');
                    return;
                }
            }
        }

        // Intentar guardar en localStorage
        const explosivoExistente = this.explosivoReportService.obtenerExplosivoPorId(row.explosivoId);
        
        let exito = false;
        if (explosivoExistente) {
            exito = this.explosivoReportService.actualizarExplosivo(row.explosivoId, row);
        } else {
            exito = this.explosivoReportService.crearExplosivo(row);
        }

        if (exito) {
            const mensaje = esActualizacion 
                ? 'Explosivo actualizado correctamente' 
                : 'Explosivo guardado correctamente';
            this.alertService.show(mensaje, 'success');
            this.editingRows.delete(i);
            this.savedRows.add(i);
            this.originalRow.delete(i); // Limpiar copia original
        } else {
            this.alertService.show('Error al guardar el explosivo', 'error');
        }
    }

    /**
     * Editar una fila guardada
     */
    editExplosivoRow(i: number) {
        // Guardar copia original para poder revertir si es necesario
        this.originalRow.set(i, JSON.parse(JSON.stringify(this.reporteExplosivos[i])));
        this.editingRows.add(i);
    }

    /**
     * Eliminar una fila
     */
    async removeExplosivoRow(i: number) {
        const row = this.reporteExplosivos[i];
        
        // Mostrar alerta de confirmación
        const confirmado = await this.alertService.confirm(
            '¿Estás seguro de que deseas eliminar este reporte?',
            {
                title: 'Eliminar explosivo',
                confirmText: 'Eliminar',
                cancelText: 'Cancelar',
                danger: true
            }
        );

        if (!confirmado) {
            return;
        }

        // Si ya fue guardado, eliminar del localStorage
        if (this.savedRows.has(i) && row.explosivoId) {
            const exito = this.explosivoReportService.eliminarExplosivo(row.explosivoId);
            if (!exito) {
                this.alertService.show('Error al eliminar el explosivo', 'error');
                return;
            }
        }

        // Remover del array
        this.reporteExplosivos.splice(i, 1);
        this.editingRows.delete(i);
        this.savedRows.delete(i);
        this.originalRow.delete(i); // Limpiar copia original
        
        this.alertService.show('Explosivo eliminado', 'success');
    }

    /**
     * Guardar todos los reportes
     */
    guardarTodos() {
        let errores = 0;
        
        this.reporteExplosivos.forEach((row, index) => {
            if (!this.isSaved(index)) {
                const explosivoExistente = this.explosivoReportService.obtenerExplosivoPorId(row.explosivoId);
                const exito = explosivoExistente 
                    ? this.explosivoReportService.actualizarExplosivo(row.explosivoId, row)
                    : this.explosivoReportService.crearExplosivo(row);
                
                if (exito) {
                    this.savedRows.add(index);
                    this.editingRows.delete(index);
                } else {
                    errores++;
                }
            }
        });

        if (errores === 0) {
            this.alertService.show('Todos los explosivos han sido guardados', 'success');
        } else {
            this.alertService.show(`${errores} explosivos fallaron al guardar`, 'error');
        }
    }

    trackByIndex(index: number) {
        return index;
    }
}