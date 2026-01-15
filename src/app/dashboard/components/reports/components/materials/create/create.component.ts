import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { MaterialService } from "../services/material.service";

@Component({
    selector: 'app-create-material',
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    imports: [
        CommonModule,RouterModule, FormsModule
    ]
})

export class CreateMaterialComponent implements OnInit {

    constructor(
        private alertService: AlertService,
        private router: Router,
        private materialService: MaterialService,
        private route: ActivatedRoute
    ) {}

    // INICIALIZAR COMPONENTE
    ngOnInit(): void {
        // Cargar datos si es edición
    }
}