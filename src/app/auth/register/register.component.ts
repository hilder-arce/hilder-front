import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "../../services/theme";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-register',
    imports: [
        FormsModule,
        RouterModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {

    constructor(public theme: ThemeService){}
  

  name: string = '';
  email: string = '';
  password: string = '';

  loaded = false;

  ngOnInit() {


    setTimeout(() => {
      this.loaded = true;
    }, 200);
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