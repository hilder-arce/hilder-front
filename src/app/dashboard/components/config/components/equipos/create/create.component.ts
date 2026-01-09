import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
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
    
    // INYECTAR SERVICIOS
    constructor(
        private alertService: AlertService,
        private router: Router,
        private equipoService: EquipoService,
        private route: ActivatedRoute
    ) {}

    // PROPIEDADES
    equipo: Equipo = {
        nombre: '',
        marca: '',
        descripcion: ''
    };
    private originalEquipo!: Equipo;
    isEquipoExist: boolean = false;

    // INICIALIZAR COMPONENTE
    ngOnInit(): void {
        // Cargar datos si es edición
        this.loadEquipoForEdit();
    }

    // ESTADO DE ACCIÓN
    isSubmitting = false;

    // TEXTO DINÁMICO
    get submitLabel(): string {
    if (this.isSubmitting && this.isEquipoExist) return 'ACTUALIZANDO...';
    if (this.isSubmitting && !this.isEquipoExist) return 'GUARDANDO...';
    return this.isEquipoExist ? 'ACTUALIZAR' : 'GUARDAR';
    }


    // METODO PARA CARGAR DATOS EN EDICIÓN
    async loadEquipoForEdit() {
        // Lógica para cargar los datos del equipo para edición
        const equipoId = this.route.snapshot.queryParamMap.get('_id');
        if (equipoId) {
            const equipoData = await this.equipoService.getEquipoById(equipoId)
                if (equipoData) {
                    this.equipo = { ...equipoData };
                    this.originalEquipo = { ...equipoData };
                    this.isEquipoExist = true;
                }
            
        }
    }

    // ACTUALIZAR EQUIPO
    async update() {

        if (this.isSubmitting) return;

        this.isSubmitting = true;

        // VALIDACIÓN: ID EXISTENTE
        const equipoId = this.route.snapshot.queryParamMap.get('_id');
        if (!equipoId) {
            this.alertService.show('No se pudo identificar el equipo a actualizar', 'error');
            this.isSubmitting = false;
            return;
        }

        // VALIDACIÓN: NOMBRE
        if (!this.equipo.nombre || !this.equipo.nombre.trim()) {
            this.alertService.show('El nombre del equipo es obligatorio', 'error');
            this.isSubmitting = false;
            return;
        }

        // VALIDACIÓN: MARCA
        if (!this.equipo.marca || !this.equipo.marca.trim()) {
            this.alertService.show('La marca del fabricante es obligatoria', 'error');
            this.isSubmitting = false;
            return;
        }

        if (this.equipo.nombre.length > 100) {
            this.alertService.show('El nombre es demasiado largo', 'error');
            this.isSubmitting = false;
            return;
        }

        // DETECTAR CAMBIOS (PATCH REAL)
        const payload: Partial<Equipo> = {};

        if (this.equipo.nombre !== this.originalEquipo.nombre) {
            payload.nombre = this.equipo.nombre;
        }

        if (this.equipo.marca !== this.originalEquipo.marca) {
            payload.marca = this.equipo.marca;
        }

        if (this.equipo.descripcion !== this.originalEquipo.descripcion) {
            payload.descripcion = this.equipo.descripcion;
        }

        // VALIDACIÓN: SIN CAMBIOS
        if (Object.keys(payload).length === 0) {
            this.alertService.show('No se detectaron cambios para actualizar', 'error');
            this.isSubmitting = false;
            return;
        }

        try {
            const res = await this.equipoService.updateEquipo(equipoId, payload);
            if (!res) return;

            this.alertService.show('Equipo actualizado correctamente', 'success');
            this.isSubmitting = false;
            this.router.navigate(['/dashboard/config/equipos/list']);

        } catch (error) {
            this.alertService.show('Error al actualizar el equipo', 'error');
            this.isSubmitting = false;
        }finally {
            this.isSubmitting = false;
        }
    }


    // GUARDAR EQUIPO
    async guardar() {

        if(this.isSubmitting) return;

        this.isSubmitting = true;

        // VALIDACIÓN: NOMBRE
        if (!this.equipo.nombre || !this.equipo.nombre.trim()) {
            this.alertService.show('El nombre del equipo es obligatorio', 'error');
            this.isSubmitting = false;
            return;
        }

        // VALIDACIÓN: MARCA
        if (!this.equipo.marca || !this.equipo.marca.trim()) {
            this.alertService.show('La marca del fabricante es obligatoria', 'error');
            this.isSubmitting = false;
            return;
        }

        if (this.equipo.nombre.length > 100) {
            this.alertService.show('El nombre es demasiado largo', 'error');
            this.isSubmitting = false;
            return;
        }

        try {
            const res = await this.equipoService.createEquipo(this.equipo);
            if (!res) return;

            this.alertService.show('Equipo registrado con éxito.', 'success');
            this.isSubmitting = false;
            this.router.navigate(['/dashboard/config/equipos']); 
        } catch (error) {
            this.alertService.show('Error al registrar el equipo', 'error');
            this.isSubmitting = false;
        }finally {
            this.isSubmitting = false;
        }
    }

}
