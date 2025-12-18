import { Injectable } from "@angular/core";
import { User } from "../interfaces/user.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class UserService {

    private readonly apiBackend = environment.apiUrl;

  //INJECTANDO A HttpClient PARA MANEJAR PETICIONES HTTP
  constructor(private http : HttpClient){}

    //CREAR USUARIO
    async createUser(newUser: User) {
        return await this.http.post<{ message: string }>(
            `${this.apiBackend}/users`, 
            newUser, { withCredentials: true }
        ).toPromise();
    } 

    //AUTHENTICACION DE USERS
    async login(email: string, password: string) {
        return await this.http.post<{ message: string, userType: string }>(
            `${environment.apiUrl}/auth/login`,
            { email, password },
            { withCredentials: true }
        ).toPromise();
    }

}