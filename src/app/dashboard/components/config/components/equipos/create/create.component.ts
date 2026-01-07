import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { Equipo } from "../interfaces/equipo.interface";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { EquipoService } from "../services/equipo.service";

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

export class CreateEquipoComponent {
    
    constructor(
        private alertService: AlertService,
        private router: Router,
        private equipoService: EquipoService
    ) {}

    equipo: Equipo = {
        nombre: '',
        marca: '',
        descripcion: ''
    };

    async guardar() {
        // VALIDACIÓN: NOMBRE
        if (!this.equipo.nombre || !this.equipo.nombre.trim()) {
            this.alertService.show('El nombre del equipo es obligatorio', 'error');
            return;
        }

        // VALIDACIÓN: MARCA
        if (!this.equipo.marca || !this.equipo.marca.trim()) {
            this.alertService.show('La marca del fabricante es obligatoria', 'error');
            return;
        }

        if (this.equipo.nombre.length > 100) {
            this.alertService.show('El nombre es demasiado largo', 'error');
            return;
        }

        try {
            const res = await this.equipoService.createEquipo(this.equipo);
            if (!res) return;

            this.alertService.show('Equipo registrado con éxito.', 'success');
            this.router.navigate(['/dashboard/config/equipos']); 
        } catch (error) {
            this.alertService.show('Error al registrar el equipo', 'error');
        }
    }

}
