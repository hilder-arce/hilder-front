import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ReportsMaterialesHeaderComponent } from "./header/header.component";

@Component({
    selector: 'app-config-materiales',
    templateUrl: './materiales.component.html',
    styleUrl: './materiales.component.css',
    imports: [
        RouterOutlet,
        ReportsMaterialesHeaderComponent
    ]
})

export class ReportsMaterialesComponent {}