import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-report-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.css',
    imports: [
        RouterModule,
        CommonModule,
    ]
})

export class ReportTableComponent { }