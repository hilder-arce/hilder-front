import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { EquipoService } from "../services/equipo.service";
import { Equipo } from "../interfaces/equipo.interface";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { EquiposSearchService } from "../services/equipos-search.service";

@Component({
    selector: 'app-list-equipos',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    imports: [
        CommonModule,
        RouterModule
    ]
})

export class ListEquiposComponent implements  OnInit {

    //INJECTAR SERVICIOS
    constructor(
        private equipoService: EquipoService,
        private router: Router,
        private alertService: AlertService,
        private searchService: EquiposSearchService
    ) { }

    //PROPIEDADES
equipos = signal<Equipo[]>([]);

    //INICIALIZAR COMPONENTE
    ngOnInit(): void {
        this.getEquipos()
    }

    //OBTENER LISTA DE EQUIPOS
    async getEquipos() {
        const equipos = await this.equipoService.getEquipos();
        if (equipos) {
            this.equipos.set(equipos);
        }
    }

    async eliminarEquipo(equipo: Equipo) {

        if (!equipo._id) return;

        const confirm = await this.alertService.confirm(
            `¿Está seguro de eliminar el equipo <b>${equipo.nombre}</b>? 
            Esta acción no se puede deshacer.`,
            {
            title: 'Eliminar equipo',
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            danger: true
            }
        );

        if (!confirm) return;

        // continuar eliminación
        try {
            const response = await this.equipoService.deactivateEquipo(equipo._id);

            if (response?.message === 'Equipo eliminado con éxito.') {
                // Eliminación lógica inmediata (UX premium)
                this.alertService.show('Equipo eliminado con éxito.', 'success');
                this.getEquipos()}
        } catch (error) {
            this.alertService.show('Error al eliminar equipo', 'error');
        }
    }


    //EDITAR EQUIPO
    editEquipo(equipo: Equipo) {
        this.router.navigate(['/dashboard/config/equipos/create'], { queryParams: { _id: equipo._id } });
    }

    //ACTIVAR EQUIPO
    async activarEquipo(equipo: Equipo) {
        if (!equipo._id) return;

        try {
            const response = await this.equipoService.activateEquipo(equipo._id);
            if (response?.message === 'Equipo activado con éxito.') {
                this.alertService.show('Equipo activado con éxito.', 'success');
                this.getEquipos();
            }

        } catch (error) {
            this.alertService.show('Error al activar equipo', 'error');
        }
    }

    // EQUIPOS FILTRADOS SEGÚN BÚSQUEDA
    filteredEquipos = computed(() => {
        const search = this.searchService.search();
        if (!search) return this.equipos();

        return this.equipos().filter(e =>
            e.nombre.toLowerCase().includes(search) ||
            e.marca.toLowerCase().includes(search) ||
            (e.descripcion ?? '').toLowerCase().includes(search)
        );
    });


}