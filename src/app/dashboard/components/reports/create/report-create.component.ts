import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-report-create',
    templateUrl: './report-create.component.html',
    styleUrl: './report-create.component.css',
    imports: [
        CommonModule,
    ]
})

export class ReportCreateComponent implements OnInit {


    fechaActual!: string;
    agente = 'Hilder Arce'

    ngOnInit(): void {
        this.fechaActual = this.obtenerFecha();
    }

    private obtenerFecha() {
        const hoy = new Date();

        const year = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');

        return `${year}-${mes}-${dia}`;
    }

}