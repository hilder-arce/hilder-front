import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersHeaderComponent } from './header/header.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
    imports: [
        CommonModule,
        RouterOutlet,
        UsersHeaderComponent,
    ]
})

export class UsersComponent { }