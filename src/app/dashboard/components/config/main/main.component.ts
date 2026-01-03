import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-config-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    imports: [
        RouterModule,
        CommonModule,
    ]
})

export class ConfigMainComponent { }