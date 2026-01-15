import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { ExplosivoService } from "../services/explosivo.service";

@Component({
    selector: 'app-create-explosivo',
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ]
})

export class CreateExplosivoComponent implements OnInit {

    constructor(
        private alertService: AlertService,
        private router: Router,
        private explosivoservice: ExplosivoService,
        private route: ActivatedRoute
      ){}


    ngOnInit(): void {
        // Cargar datos si es edición
    }


}