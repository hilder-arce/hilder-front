import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { Material } from "../../../../config/components/materials/interfaces/material.interface";
import { MaterialService } from "../../../../config/components/materials/services/material.service";
import { ReporteMaterial } from "../interfaces/material.interface";
import { MaterialReportService } from "../services/material-report.service";
import { ReportsSearchService } from "../../../services/reports-search.service";

@Component({
    selector: 'app-create-material',
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    imports: [
        CommonModule,RouterModule, FormsModule
    ]
})

export class CreateMaterialComponent implements OnInit {

    private searchService = inject(ReportsSearchService);

    constructor(
        private alertService: AlertService,
        private router: Router,
        private materialService: MaterialService,
        private materialReportService: MaterialReportService,
        private route: ActivatedRoute
    ) {}

    // INICIALIZAR COMPONENTE
    ngOnInit(): void {
        // Cargar materiales disponibles del servicio de config
        this.cargarMaterialesDisponibles();
        // Cargar reportes guardados en localStorage
        this.cargarReportesAlmacenados();
        // Escuchar cambios de búsqueda
        this.searchService.search$.subscribe(searchTerm => {
            this.filtrarMateriales(searchTerm);
        });
    }

    materiales: Material[] = [];
    reporteMateriales: ReporteMaterial[] = [];
    reporteMateriaisOriginal: ReporteMaterial[] = []; // Para guardar los datos sin filtrar
    editingRows = new Set<number>();
    savedRows = new Set<number>();
    originalRow: Map<number, ReporteMaterial> = new Map(); // Para restaurar si cancela edición

    /**
     * Filtrar materiales según la búsqueda
     */
    filtrarMateriales(searchTerm: string): void {
        if (!searchTerm.trim()) {
            this.reporteMateriales = [...this.reporteMateriaisOriginal];
        } else {
            this.reporteMateriales = this.reporteMateriaisOriginal.filter(material =>
                material.materialNombre?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    }

    /**
     * Cargar los materiales disponibles del servicio de config
     */
    async cargarMaterialesDisponibles() {
        try {
            const materiales = await this.materialService.getMateriales();
            if (materiales) {
                this.materiales = [...materiales];
            }
        } catch (error) {
        }
    }

    /**
     * Cargar los reportes guardados en localStorage
     */
    cargarReportesAlmacenados() {
        const reportes = this.materialReportService.obtenerMateriales();
        this.reporteMateriales = [...reportes];
        this.reporteMateriaisOriginal = [...reportes]; // Guardar original para filtrado
        // Marcar todos los reportes cargados como guardados
        reportes.forEach((_, index) => {
            this.savedRows.add(index);
        });
    }

    /**
     * Agregar una nueva fila para editar
     */
    addMaterialRow() {
        const nuevoReporte: ReporteMaterial = {
            materialId: '',
            materialNombre: '',
            stockInicial: 0,
            ingreso: 0,
            consumo: 0,
            stockFinal: 0,
            unidad: 'unidad',
            observacion: ''
        };
        
        this.reporteMateriales.push(nuevoReporte);
        const index = this.reporteMateriales.length - 1;
        this.editingRows.add(index);
    }

    /**
     * Calcular stock final
     */
    calcularStock(row: ReporteMaterial) {
        row.stockFinal = Number(row.stockInicial) + Number(row.ingreso) - Number(row.consumo);
    }

    /**
     * Manejar cambio de material - Obtener nombre y unidad del material seleccionado
     */
    onMaterialChange(row: ReporteMaterial) {
        const materialSeleccionado = this.materiales.find(m => m._id === row.materialId);
        if (materialSeleccionado) {
            row.materialNombre = materialSeleccionado.nombre;
            row.unidad = materialSeleccionado.unidad;
            row.stockInicial = 0;
            this.calcularStock(row);
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
    saveMaterialRow(i: number) {
        const row = this.reporteMateriales[i];
        const esNuevo = !this.isSaved(i);
        const esActualizacion = !esNuevo;

        // Validar que se seleccione un material
        if (!row.materialId || !row.materialNombre) {
            this.alertService.show('Debes seleccionar un material', 'error');
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
                    original.materialId === row.materialId &&
                    original.stockInicial === row.stockInicial &&
                    original.ingreso === row.ingreso &&
                    original.consumo === row.consumo &&
                    original.observacion === row.observacion;

                if (hayNoChanges) {
                    this.alertService.show('No hay cambios que guardar', 'warning');
                    return;
                }
            }
        }

        // Intentar guardar en localStorage
        const materialExistente = this.materialReportService.obtenerMaterialPorId(row.materialId);
        
        let exito = false;
        if (materialExistente) {
            exito = this.materialReportService.actualizarMaterial(row.materialId, row);
        } else {
            exito = this.materialReportService.crearMaterial(row);
        }

        if (exito) {
            const mensaje = esActualizacion 
                ? 'Material actualizado correctamente' 
                : 'Material guardado correctamente';
            this.alertService.show(mensaje, 'success');
            this.editingRows.delete(i);
            this.savedRows.add(i);
            this.originalRow.delete(i); // Limpiar copia original
        } else {
            this.alertService.show('Error al guardar el material', 'error');
        }
    }

    /**
     * Editar una fila guardada
     */
    editMaterialRow(i: number) {
        // Guardar copia original para poder revertir si es necesario
        this.originalRow.set(i, JSON.parse(JSON.stringify(this.reporteMateriales[i])));
        this.editingRows.add(i);
    }

    /**
     * Eliminar una fila
     */
    async removeMaterialRow(i: number) {
        const row = this.reporteMateriales[i];
        
        // Mostrar alerta de confirmación
        const confirmado = await this.alertService.confirm(
            '¿Estás seguro de que deseas eliminar este reporte?',
            {
                title: 'Eliminar material',
                confirmText: 'Eliminar',
                cancelText: 'Cancelar',
                danger: true
            }
        );

        if (!confirmado) {
            return;
        }

        // Si ya fue guardado, eliminar del localStorage
        if (this.savedRows.has(i) && row.materialId) {
            const exito = this.materialReportService.eliminarMaterial(row.materialId);
            if (!exito) {
                this.alertService.show('Error al eliminar el material', 'error');
                return;
            }
        }

        // Remover del array
        this.reporteMateriales.splice(i, 1);
        this.editingRows.delete(i);
        this.savedRows.delete(i);
        this.originalRow.delete(i); // Limpiar copia original
        
        this.alertService.show('Material eliminado', 'success');
    }

    /**
     * Guardar todos los reportes
     */
    guardarTodos() {
        let errores = 0;
        
        this.reporteMateriales.forEach((row, index) => {
            if (!this.isSaved(index)) {
                const materialExistente = this.materialReportService.obtenerMaterialPorId(row.materialId);
                const exito = materialExistente 
                    ? this.materialReportService.actualizarMaterial(row.materialId, row)
                    : this.materialReportService.crearMaterial(row);
                
                if (exito) {
                    this.savedRows.add(index);
                    this.editingRows.delete(index);
                } else {
                    errores++;
                }
            }
        });

        if (errores === 0) {
            this.alertService.show('Todos los materiales han sido guardados', 'success');
        } else {
            this.alertService.show(`${errores} materiales fallaron al guardar`, 'error');
        }
    }
}