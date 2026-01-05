import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
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

export class CreateMaterialComponent {

    constructor(
        private alertService: AlertService,
        private router: Router,
        private materialService: MaterialService
    ) {}

    material: Material = {
        id: '',
        nombre: '',
        descripcion: '',
        unidad: 'unidad' // Valor por defecto
    };

    async guardar() {
        // VALIDACIÓN: NOMBRE
        if (!this.material.nombre || !this.material.nombre.trim()) {
            this.alertService.show('El nombre del material es requerido', 'error');
            return;
        }

        // VALIDACIÓN: UNIDAD (Enum check)
        const unidadesPermitidas: Material['unidad'][] = ['unidad', 'metros', 'sacos', 'kg'];
        
        if (!unidadesPermitidas.includes(this.material.unidad)) {
            this.alertService.show('Seleccione una unidad de medida válida', 'error');
            return;
        }

        try {
            const res = await this.materialService.createMaterial(this.material);
            if (!res) return;

            this.alertService.show('Material guardado correctamente', 'success');
            this.router.navigate(['/dashboard/config/materiales/list']);
        } catch (error) {
            this.alertService.show('Hubo un problema al guardar el material', 'error');
        }
    }

}