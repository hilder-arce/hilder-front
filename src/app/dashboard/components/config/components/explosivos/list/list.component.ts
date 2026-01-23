import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { LoaderComponent } from "../../../../../../shared/componets/loader/loader.component";
import { Explosivo } from "../interfaces/explosivo.interface";
import { ExplosivoService } from "../services/explosivo.service";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { ExplosivosSearchService } from "../services/explosivos-search.service";

@Component({
  selector: 'app-explosivos-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [
    // Módulos necesarios
    CommonModule,
    RouterModule,
    LoaderComponent
  ],
})

export class ExplosivosListComponent implements OnInit {

    //INJECTAR SERVICIOS
    constructor(
        private explosivoService: ExplosivoService,
        private router: Router,
        private alertService: AlertService,
        private searchService: ExplosivosSearchService
    ) {}

    //INICIALIZAR COMPONENTE
    ngOnInit(): void {
        // Lógica de inicialización si es necesario
        this.loadExplosivos();
    }

    //PROPIEDADES
    explosivos = signal<Explosivo[]>([])
    isLoading = signal(true);

    //CARGAR LISTA DE EXPLOSIVOS
    async loadExplosivos() {
        // Lógica para cargar la lista de explosivos
        this.isLoading.set(true);
        const res = await this.explosivoService.getExplosivos();
        if (res) {
            this.explosivos.set(res);
        }
        this.isLoading.set(false);
    }

       //EDITAR EXPLOSIVO
        editExplosivo(explosive: Explosivo) {
            this.router.navigate(['/dashboard/config/explosivos/create'], { queryParams: { _id: explosive._id } });
        }

        //DESACTIVAR EXPLOSIVO
         async eliminarExplosivo(explosive: Explosivo) {
        
                if (!explosive._id) return;
        
                const confirm = await this.alertService.confirm(
                    `¿Está seguro de desactivar el explosivo <b>${explosive.nombre}</b>? 
                    Esta acción no se puede deshacer.`,
                    {
                    title: 'Desactivar explosivo',
                    confirmText: 'Sí, desactivar',
                    cancelText: 'Cancelar',
                    danger: true
                    }
                );
        
                if (!confirm) return;
        
                // continuar desactivación
                try {
                    const response = await this.explosivoService.deactivateExplosivo(explosive._id);
        
                    if (response?.message === 'Explosivo eliminado con éxito.') {
                        // Desactivación lógica inmediata (UX premium)
                        this.alertService.show(`Explosivo \"${explosive.nombre}\" desactivado con éxito`, 'success', 'Desactivación exitosa');
                        this.loadExplosivos()}
                } catch (error: any) {
                    const errorMessage = error?.error?.message || 'Error al desactivar explosivo';
                    this.alertService.show(errorMessage, 'error', 'Error en la desactivación');
                }
            }
        

        //ACTIVAR EXPLOSIVO
        async activarExplosivo(explosive: Explosivo) {
            if (!explosive._id) return;

            try {
                const response = await this.explosivoService.activateExplosivo(explosive._id);
                if (response?.message === 'Explosivo activado con éxito.') {
                    this.alertService.show(`Explosivo \"${explosive.nombre}\" activado con éxito`, 'success', 'Activación exitosa');
                    this.loadExplosivos();
                }
            } catch (error: any) {
                const errorMessage = error?.error?.message || 'Error al activar explosivo';
                this.alertService.show(errorMessage, 'error', 'Error en la activación');
            }
        }

        //FILTRAR EXPLOSIVOS SEGÚN TÉRMINO DE BÚSQUEDA
        filteredExplosivos = computed(() => {
            const search = this.searchService.search();
            if (!search) return this.explosivos();

            return this.explosivos().filter(e => 
                e.nombre.toLowerCase().includes(search) ||
                e.tipo.toLowerCase().includes(search) ||
                e.presentacion.toLowerCase().includes(search) ||
                e.unidadMedida.toLowerCase().includes(search) ||
                (e.descripcion ?? '').toLowerCase().includes(search)

            )
        })


}