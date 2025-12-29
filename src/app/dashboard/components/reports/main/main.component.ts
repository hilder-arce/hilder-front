import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReportHeaderComponent } from '../header/header.component';
import { ReportTableComponent } from '../tables/table.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-report-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    imports: [
        CommonModule,
        RouterOutlet,
        ReportHeaderComponent,
    ]
})

export class ReportComponent { }