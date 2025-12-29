import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { ThemeToggleComponent } from './shared/componets/theme/theme-toggle/theme-toggle';
import { HeaderComponent } from './static/header/header.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ThemeToggleComponent,
    HeaderComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }
