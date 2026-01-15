import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ReportsExplosivosHeaderComponent } from "./header/header.component";

@Component({
    selector: 'app-reports-explosivos',
    templateUrl: './explosivos.component.html',
    styleUrl: './explosivos.component.css',
    imports: [
        RouterOutlet,
        ReportsExplosivosHeaderComponent
    ]
})

export class ReportsExplosivosComponent {}