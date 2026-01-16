import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { Explosivo } from "../../../../config/components/explosivos/interfaces/explosivo.interface";
import { ExplosivoService } from "../../../../config/components/explosivos/services/explosivo.service";
import { ReporteExplosivo, TipoExplosivo, UnidadMedidaExplosivo } from "../interfaces/explosivo.interface";

@Component({
    selector: 'app-create-explosivo',
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ]
})

export class CreateExplosivoComponent implements OnInit {

    constructor(
        private alertService: AlertService,
        private router: Router,
        private explosivoservice: ExplosivoService,
        private route: ActivatedRoute
      ){}


    ngOnInit(): void {
        // Cargar datos si es edición
        this.loadExplosivos();
    }

    explosivos: Explosivo[] = [];
    reporteExplosivos: ReporteExplosivo[] = [];

    async loadExplosivos() {
        const res = await this.explosivoservice.getExplosivos();
        if (!res) return;
        this.explosivos = [...res];
    }

    addExplosivoRow() {
        this.reporteExplosivos.push({
            explosivoId: '',
            nombre: '',
            tipo: 'EMULSION' as TipoExplosivo,
            stockInicial: 0,
            ingreso: 0,
            consumo: 0,
            stockFinal: 0,
            unidad: 'KILOGRAMOS' as UnidadMedidaExplosivo,
            observacionesOperativas: ''
        })
    }

    removeExplosivoRow(index: number) {
        this.reporteExplosivos.splice(index, 1);
    }

    onExplosivoChange(row: ReporteExplosivo) {
    const ex = this.explosivos.find(e => e._id === row.explosivoId);
    if (!ex) return;

    row.nombre = ex.nombre;
    row.tipo = ex.tipo;
    row.unidad = ex.unidadMedida;

    this.calcularStock(row);
  }

  calcularStock(row: ReporteExplosivo) {
    const final =
      row.stockInicial +
      Number(row.ingreso || 0) -
      Number(row.consumo || 0);

    row.stockFinal = final >= 0 ? final : 0;
  }

  trackByIndex(index: number) {
    return index;
  }

}