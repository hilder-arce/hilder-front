import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "../../shared/services/theme.service";
import { Router, RouterModule } from "@angular/router";
import { UserService } from "../../shared/services/user.service";
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
    public theme: ThemeService,
    private userService: UserService,
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

    if (!this.email || !this.password) {
      this.alertService.show('Completa todos los campos','error');
      this.isLoading = false;
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.alertService.show('Por favor, ingresa un correo electrónico válido.', 'error');
      this.isLoading = false;
      return;
    }

    if (this.password.length < 6) {
      this.alertService.show('La contraseña debe tener al menos 6 caracteres.', 'error');
      this.isLoading = false;
      return;
    }

    try {
      const res = await this.userService.login(this.email, this.password);
        if(res?.message  === 'Usuario logueado con éxito.'){
          this.alertService.show(res?.message, 'success');
          // navegar al login
          this.router.navigate(['/ficha-trabajador']);
        } else {
          this.alertService.show('Error al crear la cuenta.', 'error');
        }
      
    } catch (error) {
      this.alertService.show("Credenciales incorrectas",'error');
    }finally{
      this.isLoading = false;
    }

  }

  loginWithGoogle() {
    console.log('Login con Google');
    alert('Botón de Google listo (conectar luego a backend)');
  }
}
