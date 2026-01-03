import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { EquiposHeaderComponent } from "./header/header.component";

@Component({
    selector: 'app-config-equipos',
    templateUrl: './equipos.component.html',
    styleUrl: './equipos.component.css',
    imports: [
        RouterOutlet,
        EquiposHeaderComponent
    ]
})

export class ConfigEquiposComponent {}