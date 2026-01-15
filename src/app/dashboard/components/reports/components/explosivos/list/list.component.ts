import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
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
    RouterModule
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
    }

}