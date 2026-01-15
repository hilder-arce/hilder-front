import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { EquipoService } from "../services/equipo.service";
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

    //INICIALIZAR COMPONENTE
    ngOnInit(): void {
        
    }

    //OBTENER LISTA DE EQUIPOS

}