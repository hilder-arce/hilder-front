import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../dashboard/components/users/services/auth.service";
import { AlertService } from "../../shared/services/alert.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ){}
  
  email: string = '';
  password: string = '';
  loaded = false;
  isLoading: boolean = false;

  ngOnInit() {
    setTimeout(() => {
      this.loaded = true; // animación de entrada
    }, 200);
  }

  async login() {

    this.isLoading = true;

    if (!this.email) {
      this.alertService.show('Falta introducir correo electrónico','warning', 'Correo requerido');
      this.isLoading = false;
      return;
    }

    if (!this.password) {
      this.alertService.show('Falta introducir contraseña','warning', 'Contraseña requerida');
      this.isLoading = false;
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.alertService.show('Por favor, ingresa un correo electrónico válido.', 'warning', 'Email inválido');
      this.isLoading = false;
      return;
    }

    if (this.password.length < 6) {
      this.alertService.show('La contraseña debe tener al menos 6 caracteres.', 'warning', 'Contraseña débil');
      this.isLoading = false;
      return;
    }

    try {
      const res = await this.authService.login(this.email, this.password);
        if(res?.message  === 'Login exitoso'){
          this.authService.checkSession()
          this.alertService.show(res?.message, 'success');
          // navegar al login
          this.router.navigate(['/dashboard']);
        } else {
          this.alertService.show('Error al iniciar sesión. Por favor intenta nuevamente.', 'error');
        }
      
    } catch (error: any) {
      const errorMessage = error?.error?.message || error?.message || 'Error al iniciar sesión';
      
      // Determinar el tipo de alerta según el error
      let alertType: 'error' | 'warning' | 'info' | 'success' = 'error';
      
      if (errorMessage.includes('no encontrado')) {
        alertType = 'warning';
      } else if (errorMessage.includes('Contraseña')) {
        alertType = 'error';
      }
      
      this.alertService.show(errorMessage, alertType);
    }finally{
      this.isLoading = false;
    }

  }


}
