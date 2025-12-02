import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginComponent } from './auth/login/login.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoginComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{

  constructor(private HTTP: HttpClient){}

  darkMode = false;

  async ngOnInit(): Promise<void> {
    try {

      const savedTheme = localStorage.getItem('theme');
      if(savedTheme) {
        this.darkMode = savedTheme === 'dark';
      } else {
        this.darkMode = false;
        localStorage.setItem('theme', 'light');
      }

      const response = await firstValueFrom(
        this.HTTP.get(`${environment.apiUrl}/users`)
      );

      console.log('Datos recibidos:', response);

    } catch (error) {
      console.error('Error al llamar la API:', error);
    }
  }

}
