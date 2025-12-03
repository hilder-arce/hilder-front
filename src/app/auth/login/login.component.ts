import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "../../services/theme";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        RouterModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

    constructor(public theme: ThemeService){}
  
    email: string = '';
  password: string = '';
  loaded = false;

  ngOnInit() {
    setTimeout(() => {
      this.loaded = true; // animación de entrada
    }, 200);
  }

  login() {
    if (!this.email || !this.password) {
      alert('Completa todos los campos');
      return;
    }

    console.log('Login normal:', this.email, this.password);
    alert('Login estándar listo 🚀');
  }

  loginWithGoogle() {
    console.log('Login con Google');
    alert('Botón de Google listo (conectar luego a backend)');
  }
}