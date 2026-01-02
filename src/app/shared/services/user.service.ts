import { Injectable } from "@angular/core";
import { User } from "../interfaces/user.interface";
import { HttpClient } from "@angular/common/http";
import { SesionUser } from "../interfaces/user-sesion.interface";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class UserService {

    private readonly apiBackend = environment.apiUrl;
    //private readonly apiBackend = 'http://localhost:3000/v1';


  //INJECTANDO A HttpClient PARA MANEJAR PETICIONES HTTP
  constructor(private http : HttpClient){}

    //CREAR USUARIO
    async createUser(newUser: User) {
        return await this.http.post<{ message: string }>(
            `${this.apiBackend}/users`, 
            newUser, { withCredentials: true }
        ).toPromise();
    } 

    // OBTENER TODOS LOS USUARIOS
    async getUsers() {
    return await this.http.get<User[]>(
        `${this.apiBackend}/users`,
        { withCredentials: true }
    ).toPromise();
    }

    //OBTENER USER BY ID
    async getUserById (id: string) {
        return await this.http.get<User>(
            `${this.apiBackend}/users/user/${id}`,
            { withCredentials: true }
        ).toPromise();
    }

    //UPDATED USER BY ID
    async updateUser(id: string, payload: Partial<User>) {
        console.log(payload);
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/users/${id}`,
            payload
        ).toPromise();
    }

    // DESACTIVAR USUARIO (SOFT DELETE)
    async deactivateUser(id: string) {
    return await this.http.patch<{ message: string }>(
        `${this.apiBackend}/users/${id}/deactivate`,
        {},
        { withCredentials: true }
    ).toPromise();
    }

}
