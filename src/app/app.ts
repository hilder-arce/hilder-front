import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { ThemeToggleComponent } from './shared/componets/theme/theme-toggle/theme-toggle';
import { HeaderComponent } from './static/pages/header/header.component';

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
export class App implements OnInit{

  constructor(private HTTP: HttpClient){}

 

  async ngOnInit(): Promise<void> {
    try {

      const response = await firstValueFrom(
        this.HTTP.get(`${environment.apiUrl}/users`)
      );

      console.log('Datos recibidos:', response);

    } catch (error) {
      console.error('Error al llamar la API:', error);
    }
  }

}
