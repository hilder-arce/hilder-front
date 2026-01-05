import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-main-material',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    imports: [
        CommonModule,
        RouterModule,
    ]
})

export class MainMaterialComponent {

}