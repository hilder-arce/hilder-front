import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-list-material',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
    imports: [
        CommonModule,
        RouterModule,
    ]
})

export class ListMaterialComponent {

}