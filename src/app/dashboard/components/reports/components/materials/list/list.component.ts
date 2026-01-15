import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MaterialService } from "../services/material.service";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { FormsModule } from "@angular/forms";
import { MaterialsSearchService } from "../services/materials-search.service";

@Component({
  selector: 'app-list-material',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class ListMaterialComponent implements OnInit {

  constructor(
    private materialService: MaterialService,
    private alertService: AlertService,
    private router: Router,
    private searchService: MaterialsSearchService,
  ) {}

  ngOnInit(): void {}


}
