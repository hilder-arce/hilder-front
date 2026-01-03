import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment.prod";
import { SesionUser } from "../interfaces/user-sesion.interface";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private readonly apiBackend = environment.apiUrl;
    //private readonly apiBackend = 'http://localhost:3000/v1';

    user?: SesionUser | null = null

    //INJECTANDO A HttpClient PARA MANEJAR PETICIONES HTTP
  constructor(private http : HttpClient){}

    //AUTHENTICACION DE USERS
    async login(email: string, password: string) {
        return await this.http.post<{ message: string}>(
            `${this.apiBackend}/auth/login`,
            { email, password },
            { withCredentials: true }
        ).toPromise();
    }

    // VERIFICAR SESIÓN ACTIVA (al cargar la app)
    async checkSession() {
        try {
            const user = await this.http.get<SesionUser>(
            `${this.apiBackend}/auth/me`,
            { withCredentials: true }
            ).toPromise();

            this.user = user; // en memoria
        } catch {
            this.user = null; // no hay sesión
        }
    }

    get currentUser(): SesionUser | null {
        if(this.user){
            return this.user;
        }else{
            return null
        }
    }

    get isAuthenticated(): boolean {
        return !!this.user;
    }

    //CERRAR SESION
    async logout(){
        return await this.http.get<{message: string}>(
            `${this.apiBackend}/auth/logout`,
            { withCredentials: true }
        ).toPromise();
    }

}