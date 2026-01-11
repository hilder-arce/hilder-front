import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-config-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        RouterModule,
        CommonModule,
    ]
})

export class ConfigHomeComponent { }