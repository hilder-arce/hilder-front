import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { LoaderComponent } from "../../../../../../shared/componets/loader/loader.component";
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
        RouterModule,
        LoaderComponent
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
    isLoading = signal(true);

    //INICIALIZAR COMPONENTE
    ngOnInit(): void {
        this.getEquipos()
    }

    //OBTENER LISTA DE EQUIPOS
    async getEquipos() {
        this.isLoading.set(true);
        const equipos = await this.equipoService.getEquipos();
        if (equipos) {
            this.equipos.set(equipos);
        }
        this.isLoading.set(false);
    }

    async eliminarEquipo(equipo: Equipo) {

        if (!equipo._id) return;

        const confirm = await this.alertService.confirm(
            `¿Está seguro de desactivar el equipo <b>${equipo.nombre}</b>? 
            Esta acción no se puede deshacer.`,
            {
            title: 'Desactivar equipo',
            confirmText: 'Sí, desactivar',
            cancelText: 'Cancelar',
            danger: true
            }
        );

        if (!confirm) return;

        // continuar desactivación
        try {
            const response = await this.equipoService.deactivateEquipo(equipo._id);

            if (response?.message === 'Equipo eliminado con éxito.') {
                // Desactivación lógica inmediata (UX premium)
                this.alertService.show(`Equipo \"${equipo.nombre}\" desactivado con éxito`, 'success', 'Desactivación exitosa');
                this.getEquipos()}
        } catch (error: any) {
            const errorMessage = error?.error?.message || 'Error al desactivar equipo';
            this.alertService.show(errorMessage, 'error', 'Error en la desactivación');
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
                this.alertService.show(`Equipo \"${equipo.nombre}\" activado con éxito`, 'success', 'Activación exitosa');
                this.getEquipos();
            }

        } catch (error: any) {
            const errorMessage = error?.error?.message || 'Error al activar equipo';
            this.alertService.show(errorMessage, 'error', 'Error en la activación');
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