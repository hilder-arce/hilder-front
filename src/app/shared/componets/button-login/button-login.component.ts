import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ThemeService } from "../../services/theme.service";

@Component({
    selector: 'app-button-login',
    templateUrl: './button-login.component.html',
    styleUrls: ['./button-login.component.css'],
    imports: [RouterModule, CommonModule]
})

export class ButtonLoginComponent {

    constructor(public theme: ThemeService) {}

}