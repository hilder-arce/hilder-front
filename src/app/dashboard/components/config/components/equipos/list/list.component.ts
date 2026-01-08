import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { EquipoService } from "../services/equipo.service";
import { Equipo } from "../interfaces/equipo.interface";

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
        private router: Router
    ) { }

    //PROPIEDADES
    equipos: Equipo[] = []

    //INICIALIZAR COMPONENTE
    ngOnInit(): void {
        this.getEquipos()
    }

    //OBTENER LISTA DE EQUIPOS
    async getEquipos() {
        const equipos = await this.equipoService.getEquipos();
        if (equipos) {
            this.equipos = [...equipos];
        }
    }

    //ELIMINAR EQUIPO

    //EDITAR EQUIPO
    editEquipo(equipo: Equipo) {
        this.router.navigate(['/dashboard/config/equipos/create'], { queryParams: { _id: equipo._id } });
    }

}