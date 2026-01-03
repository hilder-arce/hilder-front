import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ConfigHeaderComponent } from "./header/header.component";

@Component({
    selector: 'app-config',
    imports: [
        RouterOutlet,
        ConfigHeaderComponent
    ],
    templateUrl: './config.component.html',
    styleUrl: './config.component.css'
})

export class ConfigComponent { }