import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ReportsequiposHeaderComponent } from "./header/header.component";

@Component({
    selector: 'app-reports-equipos',
    templateUrl: './equipos.component.html',
    styleUrl: './equipos.component.css',
    imports: [
        RouterOutlet,
        ReportsequiposHeaderComponent
    ]
})

export class ReportsEquiposComponent {}