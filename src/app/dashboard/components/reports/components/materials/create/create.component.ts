import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { Material } from "../../../../config/components/materials/interfaces/material.interface";
import { MaterialService } from "../../../../config/components/materials/services/material.service";
import { ReporteMaterial } from "../interfaces/material.interface";

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
        // Cargar datos
        this.loadMateriales(); 
    }

    materiales: Material[] = [];
    reporteMateriales: ReporteMaterial[] = [];

    async  loadMateriales() {
        // Cargar materiales
        const res  = await this.materialService.getMateriales();
        if (!res) return;
        this.materiales = [...res];
    }

    addMaterialRow() {
        this.reporteMateriales.push({
            materialId: '',
            materialNombre: '',
            stockInicial: 0,
            ingreso: 0,
            consumo: 0,
            stockFinal: 0,
            unidad: "unidad",
            observacion: ''
        });
    }

    removeMaterialRow(index: number) {
        this.reporteMateriales.splice(index, 1);
    }

    onMaterialChange(row: ReporteMaterial) {
        const mat = this.materiales.find(m => m._id === row.materialId);
        if (!mat) return;

        row.materialNombre = mat.nombre;
        row.unidad = mat.unidad;

        // si luego tienes stock real, aquí se carga
        row.stockInicial = 0;

        this.calcularStock(row);
    }

    calcularStock(row: ReporteMaterial) {
        row.stockFinal =
            Number(row.stockInicial)
            + Number(row.ingreso)
            - Number(row.consumo);
    }


}