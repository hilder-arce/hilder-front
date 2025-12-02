import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-register',
    imports: [
        FormsModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {

  name: string = '';
  email: string = '';
  password: string = '';

  darkMode = true;
  loaded = false;

  ngOnInit() {

    this.darkMode = localStorage.getItem('theme') === 'dark';

    setTimeout(() => {
      this.loaded = true;
    }, 200);
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
  }

  register() {
    if (!this.name || !this.email || !this.password) {
      alert('Completa todos los campos');
      return;
    }

    console.log('Registro:', this.name, this.email, this.password);

    alert('Registro listo 🚀');
  }

  registerWithGoogle() {
    console.log('Registro con Google');
    alert('Botón de Google listo (conectar luego a backend)');
  }

}