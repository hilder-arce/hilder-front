import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { User, UserType } from "../../dashboard/components/users/interfaces/user.interface";
import { AlertService } from "../../shared/services/alert.service";
import { UserService } from "../../dashboard/components/users/services/user.service";

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
  UserType = UserType; //tipo de user
  isLoading: boolean = false //animacion mientras se crea el user
  isUserExist: boolean = false //comprobar si existe un usuario
  private originalUser!: User; //usuario original cargado desde la bd


  ngOnInit(): void {
    // activa la animación del card
    setTimeout(() => this.loaded = true, 50);

    //cargar user or editing
    this.loadUserById();
  }

  //objeto de user
  user : User = {
    nameUser: '',
    userType: null,
    email: '',
    password: ''
  }


  //CARGAR EL USUARIO A EDITAR
  async loadUserById() {
    const userid = this.route.snapshot.queryParamMap.get('_id');
    if(userid) {
      const userData = await this.userService.getUserById(userid);
      if(userData) {
        this.user = {...userData}
        this.originalUser = { ...userData }; // 🔑 snapshot
        this.isUserExist = !this.isUserExist
      }
    }
  }

  //ACTUALIZAR UN USUARIO
  async updated() {

    this.isLoading = true;

    const payload = this.buildUpdatePayload();

    if (Object.keys(payload).length === 0) {
      this.alertService.show('No hay cambios para actualizar.', 'info', 'Sin cambios');
      this.isLoading = false;
      return;
    }

    try {
      const userId = this.user._id!;
      const response = await this.userService.updateUser(userId, payload);

      if (response?.message === 'Usuario actualizado con éxito.') {
        this.alertService.show(response.message, 'success');

        // refrescar snapshot
        this.originalUser = { ...this.user };

        // volver a la lista
        this.router.navigate(['../list'], { relativeTo: this.route });
      } else {
        this.alertService.show('No se pudo actualizar el usuario.', 'error');
      }

    } catch (error: any) {
      const errorMessage = error?.error?.message || error?.message || 'Error al actualizar el usuario';
      this.alertService.show(errorMessage, 'error');
    } finally {
      this.isLoading = false;
    }
  }


  //REGISTRAR NUEVO USUARIO
  async register() {

    this.isLoading = true;

    // Validación de name
    if (!this.user.nameUser) {
      this.alertService.show('Falta introducir el nombre de usuario.', 'warning', 'Nombre requerido');
      this.isLoading = false;
      return;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(this.user.nameUser)) {
      this.alertService.show('El nombre solo debe contener letras.', 'warning', 'Nombre inválido');
      this.isLoading = false;
      return;
    }

    // Validación de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.user.email) {
      this.alertService.show('Falta introducir correo electrónico.', 'warning', 'Email requerido');
      this.isLoading = false;
      return;
    }
    if (!emailPattern.test(this.user.email)) {
      this.alertService.show('Por favor, ingresa un correo electrónico válido.', 'warning', 'Email inválido');
      this.isLoading = false;
      return;
    }

    // Validación de cargo
    if (!this.user.userType) {
      this.alertService.show('Debes seleccionar un cargo.', 'warning', 'Cargo requerido');
      this.isLoading = false;
      return;
    }

    // Validación de contraseña
    if (!this.user.password) {
      this.alertService.show('Falta introducir contraseña.', 'warning', 'Contraseña requerida');
      this.isLoading = false;
      return;
    }
    if (this.user.password.length < 6) {
      this.alertService.show('La contraseña debe tener al menos 6 caracteres.', 'warning', 'Contraseña débil');
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

    } catch (error: any) {
      const errorMessage = error?.error?.message || error?.message || 'Error al crear la cuenta';
      this.alertService.show(errorMessage, 'error');
    }finally{
      this.isLoading = false;
    }
  
  }

  //payload solo de datos cambiados 
  private buildUpdatePayload(): Partial<User> {
    const payload: Partial<User> = {};

    if (this.user.nameUser !== this.originalUser.nameUser) {
      payload.nameUser = this.user.nameUser;
    }

    if (this.user.email !== this.originalUser.email) {
      payload.email = this.user.email;
    }

    if (this.user.userType !== this.originalUser.userType) {
      payload.userType = this.user.userType;
    }

    return payload;
  }

}
