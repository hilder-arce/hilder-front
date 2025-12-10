import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "../../services/theme";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { User, UserType } from "../../shared/interfaces/user.interface";
import { UserService } from "../../shared/services/user.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']   
})
export class RegisterComponent implements OnInit {

  constructor(
    public theme: ThemeService,
    private userService: UserService,
    private router: Router
  ) {}

  // CONTROL DE ANIMACIÓN
  loaded: boolean = false;

  ngOnInit(): void {
    // activa la animación del card
    setTimeout(() => this.loaded = true, 50);
  }

  //objeto de user
  user : User = {
    nameUser: '',
    userType: UserType.Agente,
    email: '',
    password: ''
  }

  UserType = UserType;
  isLoading: boolean = false

  async register() {

    this.isLoading = true;

    // Validación de name
    if (!this.user.nameUser) {
      this.showCustomAlert('El nombre de usario no debe estar vacío.', 'error');
      this.isLoading = false;
      return;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(this.user.nameUser)) {
      this.showCustomAlert('El nombre solo debe contener letras.', 'error');
      this.isLoading = false;
      return;
    }

    // Validación de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.user.email) {
      this.showCustomAlert('El correo electrónico no debe estar vacío.', 'error');
      this.isLoading = false;
      return;
    }
    if (!emailPattern.test(this.user.email)) {
      this.showCustomAlert('Por favor, ingresa un correo electrónico válido.', 'error');
      this.isLoading = false;
      return;
    }

    // Validación de contraseña
    if (!this.user.password) {
      this.showCustomAlert('La contraseña no debe estar vacía.', 'error');
      this.isLoading = false;
      return;
    }
    if (this.user.password.length < 6) {
      this.showCustomAlert('La contraseña debe tener al menos 6 caracteres.', 'error');
      this.isLoading = false;
      return;
    }
    
    // if (this.router.url !== '/admin-user') {
    //   this.loadUserData();
    // }

    try {
      const response = await this.userService.createUser(this.user);

        if(response?.message  === 'Usuario creado con éxito.'){
          this.showCustomAlert(response?.message, 'success');
          // navegar al login
          this.router.navigate(['/login']);
        } else {
          this.showCustomAlert('Error al crear la cuenta.', 'error');
        }

    } catch (error) {
      this.showCustomAlert('Error al crear la cuenta.', 'error');
    }finally{
      this.isLoading = false;
    }
  
  }

  // ALERTA FUTURISTA PREMIUM
showCustomAlert(message: string, type: 'success' | 'error') {

  // Remover si ya hay una alerta activa
  const oldAlert = document.querySelector('.custom-alert-overlay');
  if (oldAlert) oldAlert.remove();

  // Crear overlay
  const overlay = document.createElement('div');
  overlay.classList.add('custom-alert-overlay');

  // Crear contenedor principal
  const box = document.createElement('div');
  box.classList.add('custom-alert-box');
  box.classList.add(type === 'success' ? 'custom-alert-success' : 'custom-alert-error');

  // Íconos futuristas SVG
  const iconSvg =
    type === 'success'
      ? `
      <svg class="custom-alert-icon" viewBox="0 0 24 24" fill="none" stroke="#00f2ff" stroke-width="2.5">
        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
      : `
      <svg class="custom-alert-icon" viewBox="0 0 24 24" fill="none" stroke="#ff5e5e" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>`;

  // Insertar contenido
  box.innerHTML = `
      ${iconSvg}
      <div class="custom-alert-title">
        ${type === 'success' ? 'Operación Exitosa' : 'Error'}
      </div>
      <div class="custom-alert-message">${message}</div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Auto cierre con animación
  setTimeout(() => {
    box.style.animation = 'fadeOutAlert 0.35s forwards';
    setTimeout(() => overlay.remove(), 350);
  }, 1600);
}


}
