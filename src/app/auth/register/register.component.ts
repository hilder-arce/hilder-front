import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { User, UserType } from "../../shared/interfaces/user.interface";
import { UserService } from "../../shared/services/user.service";
import { AlertService } from "../../shared/services/alert.service";

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
    private alertService: AlertService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // CONTROL DE ANIMACIÓN
  loaded: boolean = false;

  ngOnInit(): void {
    // activa la animación del card
    setTimeout(() => this.loaded = true, 50);

    //cargar user or editing
    this.loadUserById();
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

  async loadUserById() {
    const userid = this.route.snapshot.queryParamMap.get('_id');
    if(userid) {
      const userData = await this.userService.getUserById(userid);
      if(userData) {
        this.user = {...userData}
      }
    }
  }

  async register() {

    this.isLoading = true;

    // Validación de name
    if (!this.user.nameUser) {
      this.alertService.show('El nombre de usario no debe estar vacío.', 'error');
      this.isLoading = false;
      return;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(this.user.nameUser)) {
      this.alertService.show('El nombre solo debe contener letras.', 'error');
      this.isLoading = false;
      return;
    }

    // Validación de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.user.email) {
      this.alertService.show('El correo electrónico no debe estar vacío.', 'error');
      this.isLoading = false;
      return;
    }
    if (!emailPattern.test(this.user.email)) {
      this.alertService.show('Por favor, ingresa un correo electrónico válido.', 'error');
      this.isLoading = false;
      return;
    }

    // Validación de contraseña
    if (!this.user.password) {
      this.alertService.show('La contraseña no debe estar vacía.', 'error');
      this.isLoading = false;
      return;
    }
    if (this.user.password.length < 6) {
      this.alertService.show('La contraseña debe tener al menos 6 caracteres.', 'error');
      this.isLoading = false;
      return;
    }
    
    try {
      const response = await this.userService.createUser(this.user);

        if(response?.message  === 'Usuario creado con éxito.'){
          this.alertService.show(response?.message, 'success');
          // navegar a la interfaz de users
          this.router.navigate(['../list'], { relativeTo: this.route });

        } else {
          this.alertService.show('Error al crear la cuenta.', 'error');
        }

    } catch (error) {
      this.alertService.show('Error al crear la cuenta.', 'error');
    }finally{
      this.isLoading = false;
    }
  
  }

}
