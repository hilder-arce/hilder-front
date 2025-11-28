import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
