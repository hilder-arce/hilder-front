import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Material } from "../interfaces/material.interface";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { MaterialService } from "../services/material.service";

@Component({
    selector: 'app-create-material',
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    imports: [
        CommonModule,RouterModule, FormsModule
    ]
})

export class CreateMaterialComponent implements OnInit {

    constructor(
        private alertService: AlertService,
        private router: Router,
        private materialService: MaterialService,
        private route: ActivatedRoute
    ) {}

    material: Material = {
        nombre: '',
        descripcion: '',
        unidad: 'unidad' // Valor por defecto
    };
    private originalMaterial!: Material;
    isExistMaterial: boolean = false;
    // ESTADO DE ACCIÓN
    isSubmitting = false;

    ngOnInit(): void {
        this.loadMaterialById();
    }

    // TEXTO DINÁMICO (UX CONSISTENTE)
    get submitLabel(): string {
        if (this.isSubmitting && this.isExistMaterial) return 'ACTUALIZANDO...';
        if (this.isSubmitting && !this.isExistMaterial) return 'GUARDANDO...';
        return this.isExistMaterial ? 'ACTUALIZAR' : 'GUARDAR';
    }

    async loadMaterialById () {
        // Lógica para cargar los datos del material para edición
        const materialId = this.route.snapshot.queryParamMap.get('_id');
        if (materialId) {
            const materialData = await this.materialService.getMaterialById(materialId)
                if (materialData) {
                    this.material = materialData;
                    this.originalMaterial = { ...materialData };
                    this.isExistMaterial = true;
                }
        }
    }

    // ===============================
    // ACTUALIZAR MATERIAL
    // ===============================
    async update() {

        if (this.isSubmitting) return;
        this.isSubmitting = true;

        const materialId = this.route.snapshot.queryParamMap.get('_id');
        if (!materialId) {
        this.alertService.show('No se pudo identificar el material a actualizar', 'error', 'Error de identificación');
        this.isSubmitting = false;
        return;
        }

        // VALIDACIÓN: NOMBRE
        if (!this.material.nombre || !this.material.nombre.trim()) {
        this.alertService.show('El nombre del material es obligatorio', 'warning', 'Nombre requerido');
        this.isSubmitting = false;
        return;
        }

        if (this.material.nombre.trim().length < 3) {
        this.alertService.show('El nombre debe tener al menos 3 caracteres', 'warning', 'Nombre muy corto');
        this.isSubmitting = false;
        return;
        }

        // VALIDACIÓN: UNIDAD
        const unidadesPermitidas: Material['unidad'][] = [
        'unidad',
        'metros',
        'sacos',
        'kg'
        ];

        if (!unidadesPermitidas.includes(this.material.unidad)) {
        this.alertService.show('Unidad de medida no válida', 'warning', 'Unidad inválida');
        this.isSubmitting = false;
        return;
        }

        // ===============================
        // DETECTAR CAMBIOS (PATCH REAL)
        // ===============================
        const payload: Partial<Material> = {};

        if (this.material.nombre !== this.originalMaterial.nombre) {
        payload.nombre = this.material.nombre.trim();
        }

        if (this.material.descripcion !== this.originalMaterial.descripcion) {
        payload.descripcion = this.material.descripcion;
        }

        if (this.material.unidad !== this.originalMaterial.unidad) {
        payload.unidad = this.material.unidad;
        }

        if (Object.keys(payload).length === 0) {
        this.alertService.show('No se detectaron cambios para actualizar', 'info', 'Sin cambios');
        this.isSubmitting = false;
        return;
        }

        // ===============================
        // ACTUALIZAR
        // ===============================
        try {
        const res = await this.materialService.updateMaterial(materialId, payload);
        if (!res) return;

        this.alertService.show(`Material \"${this.material.nombre}\" actualizado correctamente`, 'success', 'Actualización exitosa');
        this.router.navigate(['/dashboard/config/materiales/list']);
        } catch (error: any) {
        const errorMessage = error?.error?.message || 'Error al actualizar el material';
        this.alertService.show(errorMessage, 'error', 'Error en la actualización');
        } finally {
        this.isSubmitting = false;
        }
    }

    async guardar() {

        if (this.isSubmitting) return; // Evitar múltiples envíos
        this.isSubmitting = true;

        // VALIDACIÓN: NOMBRE
        if (!this.material.nombre || !this.material.nombre.trim()) {
            this.alertService.show('El nombre del material es requerido', 'warning', 'Nombre requerido');
            this.isSubmitting = false;
            return;
        }

        // VALIDACIÓN: UNIDAD (Enum check)
        const unidadesPermitidas: Material['unidad'][] = ['unidad', 'metros', 'sacos', 'kg'];
        
        if (!unidadesPermitidas.includes(this.material.unidad)) {
            this.alertService.show('Seleccione una unidad de medida válida', 'warning', 'Unidad inválida');
            this.isSubmitting = false;
            return;
        }

        try {
            const res = await this.materialService.createMaterial(this.material);
            if (!res) return;

            this.alertService.show(`Material \"${this.material.nombre}\" registrado con éxito`, 'success', 'Creación exitosa');
            this.router.navigate(['/dashboard/config/materiales/list']);
        } catch (error: any) {
            const errorMessage = error?.error?.message || 'Hubo un problema al guardar el material';
            this.alertService.show(errorMessage, 'error', 'Error en la creación');
        } finally {
            this.isSubmitting = false;
        }
    }

}