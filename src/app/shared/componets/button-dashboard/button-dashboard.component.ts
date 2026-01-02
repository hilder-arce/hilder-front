import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-button-dashboard',
    templateUrl: './button-dashboard.component.html',
    styleUrls: ['./button-dashboard.component.css'],
    imports: [RouterModule, CommonModule]
})

export class ButtonDashboardComponent {}