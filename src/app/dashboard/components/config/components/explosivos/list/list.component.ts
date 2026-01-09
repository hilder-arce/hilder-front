import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Explosivo } from "../interfaces/explosivo.interface";
import { ExplosivoService } from "../services/explosivo.service";
import { AlertService } from "../../../../../../shared/services/alert.service";

@Component({
  selector: 'app-explosivos-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [
    // Módulos necesarios
    CommonModule,
    RouterModule
  ],
})

export class ExplosivosListComponent implements OnInit {

    constructor(
        private explosivoService: ExplosivoService,
        private router: Router,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        // Lógica de inicialización si es necesario
        this.loadExplosivos();
    }

    explosivos: Explosivo[] = []

    async loadExplosivos() {
        // Lógica para cargar la lista de explosivos
        const res = await this.explosivoService.getExplosivos();
        if (res) {
            this.explosivos = res;
        }
    }

       //EDITAR EXPLOSIVO
        editExplosivo(explosive: Explosivo) {
            this.router.navigate(['/dashboard/config/explosivos/create'], { queryParams: { _id: explosive._id } });
        }

        //DESACTIVAR EXPLOSIVO
         async eliminarExplosivo(explosive: Explosivo) {
        
                if (!explosive._id) return;
        
                const confirm = await this.alertService.confirm(
                    `¿Está seguro de eliminar el explosivo <b>${explosive.nombre}</b>? 
                    Esta acción no se puede deshacer.`,
                    {
                    title: 'Eliminar explosivo',
                    confirmText: 'Sí, eliminar',
                    cancelText: 'Cancelar',
                    danger: true
                    }
                );
        
                if (!confirm) return;
        
                // continuar eliminación
                try {
                    const response = await this.explosivoService.deactivateExplosivo(explosive._id);
        
                    if (response?.message === 'Explosivo eliminado con éxito.') {
                        // Eliminación lógica inmediata (UX premium)
                        this.alertService.show('Explosivo eliminado con éxito.', 'success');
                        this.loadExplosivos()}
                } catch (error) {
                    this.alertService.show('Error al eliminar explosivo', 'error');
                }
            }
        

        //ACTIVAR EXPLOSIVO
        async activarExplosivo(explosive: Explosivo) {
            if (!explosive._id) return;

            try {
                const response = await this.explosivoService.activateExplosivo(explosive._id);
                if (response?.message === 'Explosivo activado con éxito.') {
                    this.alertService.show('Explosivo activado con éxito.', 'success');
                    this.loadExplosivos();
                }
            } catch (error) {
                this.alertService.show('Error al activar explosivo', 'error');
            }
        }



}