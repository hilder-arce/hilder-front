import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './ficha-trabajador.html',
  styleUrl: './ficha-trabajador.css'
})
export class FichaTrabajadorComponent implements OnInit {

  activeTab: 'general' | 'academica' | 'complementaria' = 'general';

nombre = '';
apellidos = '';
dni = '';
fechaNacimiento = '';
sexo = '';
estadoCivil = '';
celular = '';
direccion = '';

nivelEstudio = '';
carrera = '';
centroEstudios = '';
anioEgreso: any = '';

cargo = '';
area = '';
fechaIngreso = '';
tipoContrato = '';
salario: any = '';
observaciones = '';


  constructor(){}

  name: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  loaded = false;

  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 200);
  }

  register() {
    console.log({
  nombre: this.nombre,
  apellidos: this.apellidos,
  dni: this.dni,
  fechaNacimiento: this.fechaNacimiento,
  sexo: this.sexo,
  estadoCivil: this.estadoCivil,
  celular: this.celular,
  direccion: this.direccion,
  nivelEstudio: this.nivelEstudio,
  carrera: this.carrera,
  centroEstudios: this.centroEstudios,
  anioEgreso: this.anioEgreso,
  cargo: this.cargo,
  area: this.area,
  fechaIngreso: this.fechaIngreso,
  tipoContrato: this.tipoContrato,
  salario: this.salario,
  observaciones: this.observaciones,
});


    if (!this.name || !this.email || !this.username || !this.password || !this.confirmPassword) {
      alert('Completa todos los campos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const payload = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    };

    console.log('Registro:', payload);

    // Aquí después conectas a tu backend (API)
    alert('Registro listo 🚀');
  }

  registerWithGoogle() {
    console.log('Registro con Google');
    alert('Botón de Google listo (conectar luego a backend)');
  }

}
