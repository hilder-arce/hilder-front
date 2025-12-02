import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-login',
    imports: [
        FormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

     email: string = '';
  password: string = '';

  darkMode = true;
  loaded = false;

  ngOnInit() {

    this.darkMode = localStorage.getItem('theme') === 'dark';

    setTimeout(() => {
      this.loaded = true; // animación de entrada
    }, 200);
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
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