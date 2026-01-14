import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsHomeHeaderComponent } from './header/header.component';

@Component({
    selector: 'app-report-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        RouterModule,
        CommonModule,
        ReportsHomeHeaderComponent
    ]
})

export class ReportsHomeComponent { }