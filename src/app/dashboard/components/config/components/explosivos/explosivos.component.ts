import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ExplosivosHeaderComponent } from "./header/header.component";

@Component({
    selector: 'app-config-explosivos',
    templateUrl: './explosivos.component.html',
    styleUrl: './explosivos.component.css',
    imports: [
        RouterOutlet,
        ExplosivosHeaderComponent
    ]
})

export class ConfigExplosivosComponent {}