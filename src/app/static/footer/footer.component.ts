import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

//COMPONENTE DEL FOOTER
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    imports: [RouterModule]
})

export class FooterComponent {
    currentYear = new Date().getFullYear();
}