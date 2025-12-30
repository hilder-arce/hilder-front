import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReportHeaderComponent } from './header/header.component';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrl: './report.component.css',
    imports: [
        CommonModule,
        RouterOutlet,
        ReportHeaderComponent,
    ]
})

export class ReportComponent { }