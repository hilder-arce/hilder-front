import { Component, OnInit } from "@angular/core";
import { Explosivo } from "../interfaces/explosivo.interface";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { ExplosivoService } from "../services/explosivo.service";

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
        private explosivoservice: ExplosivoService,
        private route: ActivatedRoute
      ){}

    explosivo: Explosivo = {
        nombre: '',
        tipo: 'EMULSION',
        presentacion: 'CARTUCHO',
        unidadMedida: 'CARTUCHOS',
        descripcion: '',
    }; 
    private originalExplosivo!: Explosivo;
    isExistExplosive: boolean = false;
    // ESTADO DE ACCIÓN
    isSubmitting = false;

    ngOnInit(): void {
        // Cargar datos si es edición
        this.loadExplosivoById();
    }


    // TEXTO DINÁMICO
    get submitLabel(): string {
    if (this.isSubmitting && this.isExistExplosive) return 'ACTUALIZANDO...';
    if (this.isSubmitting && !this.isExistExplosive) return 'GUARDANDO...';
    return this.isExistExplosive ? 'ACTUALIZAR' : 'GUARDAR';
    }

    // METODO PARA CARGAR DATOS EN EDICIÓN
    async loadExplosivoById () {
        // Lógica para cargar los datos del explosivo para edición
        const explosiveId = this.route.snapshot.queryParamMap.get('_id');
        if (explosiveId) {
            const explosiveData = await this.explosivoservice.getExplosivoById(explosiveId)
                if (explosiveData) {
                    this.explosivo = { ...explosiveData };
                    this.originalExplosivo = { ...explosiveData };
                    this.isExistExplosive = true;
                }
            
        }
    }

    // ACTUALIZAR EXPLOSIVO
    async update() {

        if (this.isSubmitting) return;

        this.isSubmitting = true;

        // VALIDACIÓN: ID EXISTENTE
        const explosivoId = this.route.snapshot.queryParamMap.get('_id');
        if (!explosivoId) {
            this.alertService.show('No se pudo identificar el explosivo a actualizar', 'error');
            this.isSubmitting = false;
            return;
        }

        // ===============================
        // VALIDACIÓN: NOMBRE
        // ===============================
        if (!this.explosivo.nombre || !this.explosivo.nombre.trim()) {
            this.alertService.show('El nombre del explosivo es obligatorio', 'error');
            this.isSubmitting = false;
            return;
        }

        if (this.explosivo.nombre.trim().length < 3) {
            this.alertService.show('El nombre debe tener al menos 3 caracteres', 'error');
            this.isSubmitting = false;
            return;
        }

        if (this.explosivo.nombre.length > 100) {
            this.alertService.show('El nombre no debe exceder los 100 caracteres', 'error');
            this.isSubmitting = false;
            return;
        }

        // ===============================
        // VALIDACIÓN: TIPO
        // ===============================
        const tiposPermitidos: Explosivo['tipo'][] = [
            'EMULSION',
            'DINAMITA',
            'CORDON_DETONANTE',
            'DETONADOR'
        ];

        if (!tiposPermitidos.includes(this.explosivo.tipo)) {
            this.alertService.show('Tipo de explosivo no válido', 'error');
            this.isSubmitting = false;
            return;
        }

        // ===============================
        // VALIDACIÓN: PRESENTACIÓN
        // ===============================
        const presentacionesPermitidas: Explosivo['presentacion'][] = [
            'CARTUCHO',
            'GRANEL',
            'ROLLO',
            'UNIDAD'
        ];

        if (!presentacionesPermitidas.includes(this.explosivo.presentacion)) {
            this.alertService.show('Presentación no válida', 'error');
            this.isSubmitting = false;
            return;
        }

        // ===============================
        // VALIDACIÓN: UNIDAD DE MEDIDA
        // ===============================
        const unidadesPermitidas: Explosivo['unidadMedida'][] = [
            'CARTUCHOS',
            'KILOGRAMOS',
            'METROS',
            'UNIDADES'
        ];

        if (!unidadesPermitidas.includes(this.explosivo.unidadMedida)) {
            this.alertService.show('Unidad de medida no válida', 'error');
            this.isSubmitting = false;
            return;
        }

        // ===============================
        // DETECTAR CAMBIOS (PATCH REAL)
        // ===============================
        const payload: Partial<Explosivo> = {};

        if (this.explosivo.nombre !== this.originalExplosivo.nombre) {
            payload.nombre = this.explosivo.nombre;
        }

        if (this.explosivo.tipo !== this.originalExplosivo.tipo) {
            payload.tipo = this.explosivo.tipo;
        }

        if (this.explosivo.presentacion !== this.originalExplosivo.presentacion) {
            payload.presentacion = this.explosivo.presentacion;
        }

        if (this.explosivo.unidadMedida !== this.originalExplosivo.unidadMedida) {
            payload.unidadMedida = this.explosivo.unidadMedida;
        }

        if (this.explosivo.descripcion !== this.originalExplosivo.descripcion) {
            payload.descripcion = this.explosivo.descripcion;
        }

        // VALIDACIÓN: SIN CAMBIOS
        if (Object.keys(payload).length === 0) {
            this.alertService.show('No se detectaron cambios para actualizar', 'info', 'Sin cambios');
            this.isSubmitting = false;
            return;
        }

        // ===============================
        // ACTUALIZAR
        // ===============================
        try {
            const res = await this.explosivoservice.updateExplosivo(explosivoId, payload);
            if (!res) return;

            this.alertService.show(`Explosivo \"${this.explosivo.nombre}\" actualizado correctamente`, 'success', 'Actualización exitosa');
            this.router.navigate(['/dashboard/config/explosivos/list']);

        } catch (error: any) {
            const errorMessage = error?.error?.message || 'Error al actualizar el explosivo';
            this.alertService.show(errorMessage, 'error', 'Error en la actualización');
        } finally {
            this.isSubmitting = false;
        }
    }
    
        // GUARDAR NUEVO EXPLOSIVO

    async guardar() {
        if (this.isSubmitting) return;
        this.isSubmitting = true;

        // ===============================
        // VALIDACIÓN: NOMBRE
        // ===============================
        if (!this.explosivo.nombre || !this.explosivo.nombre.trim()) {
            this.alertService.show('El nombre del explosivo es obligatorio', 'error');
            this.isSubmitting = false;
            return;
        }

        if (this.explosivo.nombre.trim().length < 3) {
            this.alertService.show('El nombre debe tener al menos 3 caracteres', 'error');
            this.isSubmitting = false;
            return;
        }

        if (this.explosivo.nombre.length > 100) {
            this.alertService.show('El nombre no debe exceder los 100 caracteres', 'error');
            this.isSubmitting = false;
            return;
        }

        // ===============================
        // VALIDACIÓN: TIPO
        // ===============================
        const tiposPermitidos: Explosivo['tipo'][] = [
            'EMULSION',
            'DINAMITA',
            'CORDON_DETONANTE',
            'DETONADOR'
        ];

        if (!tiposPermitidos.includes(this.explosivo.tipo)) {
            this.alertService.show('Tipo de explosivo no válido', 'error');
            this.isSubmitting = false;
            return;
        }

        // ===============================
        // VALIDACIÓN: PRESENTACIÓN
        // ===============================
        const presentacionesPermitidas: Explosivo['presentacion'][] = [
            'CARTUCHO',
            'GRANEL',
            'ROLLO',
            'UNIDAD'
        ];

        if (!presentacionesPermitidas.includes(this.explosivo.presentacion)) {
            this.alertService.show('Presentación no válida', 'error');
            this.isSubmitting = false;
            return;
        }

        // ===============================
        // VALIDACIÓN: UNIDAD DE MEDIDA
        // ===============================
        const unidadesPermitidas: Explosivo['unidadMedida'][] = [
            'CARTUCHOS',
            'KILOGRAMOS',
            'METROS',
            'UNIDADES'
        ];

        if (!unidadesPermitidas.includes(this.explosivo.unidadMedida)) {
            this.alertService.show('Unidad de medida no válida', 'error');
            this.isSubmitting = false;
            return;
        }


        try {
            const res = await this.explosivoservice.createExplosivo(this.explosivo);
            if (!res) return;

            this.alertService.show(`Explosivo \"${this.explosivo.nombre}\" registrado con éxito`, 'success', 'Creación exitosa');
            this.isSubmitting = false;
            this.router.navigate(['/dashboard/config/explosivos/list']);
        } catch (error: any) {
            const errorMessage = error?.error?.message || 'Error al registrar explosivo';
            this.alertService.show(errorMessage, 'error', 'Error en la creación');
            this.isSubmitting = false;
        }
    }

}