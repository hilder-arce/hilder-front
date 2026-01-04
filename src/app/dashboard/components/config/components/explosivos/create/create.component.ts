import { Component } from "@angular/core";
import { Explosivo } from "../interfaces/explosivo.interface";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
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

export class CreateExplosivoComponent {

    constructor(
        private alertService: AlertService,
        private router: Router,
        private explosivoservice: ExplosivoService
      ){}

    explosivo: Explosivo = {
        id: '',
        nombre: '',
        tipo: 'EMULSION',
        presentacion: 'CARTUCHO',
        unidadMedida: 'CARTUCHOS',
        descripcion: '',
    }; 

    async guardar() {

        // ===============================
        // VALIDACIÓN: NOMBRE
        // ===============================
        if (!this.explosivo.nombre || !this.explosivo.nombre.trim()) {
            this.alertService.show('El nombre del explosivo es obligatorio', 'error');
            return;
        }

        if (this.explosivo.nombre.trim().length < 3) {
            this.alertService.show('El nombre debe tener al menos 3 caracteres', 'error');
            return;
        }

        if (this.explosivo.nombre.length > 100) {
            this.alertService.show('El nombre no debe exceder los 100 caracteres', 'error');
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
            return;
        }


        try {
            const res = await this.explosivoservice.createExplosivo(this.explosivo);
            if (!res) return;

            this.alertService.show(res.message, 'success');
            this.router.navigate(['../list'], { relativeTo: this.router.routerState.root });
        } catch (error) {
            this.alertService.show('Error al registrar explosivo', 'error');
        }
    }

}