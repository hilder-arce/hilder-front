import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { EquipoService } from "../../../../config/components/equipos/services/equipo.service";
import { Equipo } from "../../../../config/components/equipos/interfaces/equipo.interface";
import { ReporteEquipo } from "../interfaces/equipo.interface";

@Component({
    selector: 'app-create-equipo',
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ]
})

export class CreateEquipoComponent implements  OnInit {
    
    // INYECTAR SERVICIOS
    constructor(
        private alertService: AlertService,
        private router: Router,
        private equipoService: EquipoService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Cargar equipos
        this.loadEquipos();
    }

    // PROPIEDADES 
    equipos: Equipo[] = [];// sevira para el select
    reporteEquipos: ReporteEquipo[] = [];

    async loadEquipos(){
        const res = await this.equipoService.getEquipos();
        if(!res) return;
        this.equipos = [...res];
    }

    addEquipoRow() {
        this.reporteEquipos.push({
        equipoId: '',
        equipoNombre: '',

        horometroInicial: 0,
        horometroFinal: 0,

        horasTrabajadas: 0,
        combustibleGalones: 0,

        estado: 'OPERATIVO',
        observacion: ''
        });
        const index = this.reporteEquipos.length - 1;
        this.editingRows.add(index);
    }

    calcularHoras(row: ReporteEquipo) {
        if (row.horometroFinal >= row.horometroInicial) {
            row.horasTrabajadas = Number(
            (row.horometroFinal - row.horometroInicial).toFixed(1)
            );
        } else {
            row.horasTrabajadas = 0;
        }
    }
  

    onEquipoChange(row: ReporteEquipo) {
        const eq = this.equipos.find(e => e._id === row.equipoId);
        row.equipoNombre = eq ? eq.nombre : '';
    }

    editingRows = new Set<number>();
    savedRows = new Set<number>();

    isEditing(i: number): boolean {
        return this.editingRows.has(i);
    }

        isSaved(i: number): boolean {
        return this.savedRows.has(i);
    }

    saveRow(i: number) {
        const row = this.reporteEquipos[i];

        console.log('Guardando fila:', row);
    }

    editRow(i: number) {
        this.editingRows.add(i);
    }

    removeEquipoRow(i: number) {
        this.reporteEquipos.splice(i, 1);
        this.editingRows.delete(i);
        this.savedRows.delete(i);
    }


}
