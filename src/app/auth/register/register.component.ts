import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "../../services/theme";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { User, UserType } from "../../shared/interfaces/user.interface";

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

  constructor(public theme: ThemeService) {}

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

  register(user: User) {
    console.log(user)
    alert(`Usuario registrado: ${user.nameUser}`);
  }

}
