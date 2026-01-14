import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../../../environments/environment.prod";
import { Explosivo } from "../interfaces/explosivo.interface";

@Injectable({
    providedIn: 'root'
})

export class ExplosivoService {

    private readonly apiBackend = environment.apiUrl;    
    
    //INJECTANDO A HttpClient PARA MANEJAR PETICIONES HTTP
    constructor(private http : HttpClient){}

    //CREAR EXPLOSIVO
    async createExplosivo(newExplosive: Explosivo) {
        return await this.http.post<{ message: string }>(
            `${this.apiBackend}/explosivo`, newExplosive,
             { withCredentials: true }
        ).toPromise();
    } 

    // OBTENER TODOS LOS EXPLOSIVOS
    async getExplosivos() {
    return await this.http.get<Explosivo[]>(
        `${this.apiBackend}/explosivo`,
        { withCredentials: true }
    ).toPromise();
    }

    //OBTENER EXPLOSIVO BY ID
    async getExplosivoById (id: string) {
        return await this.http.get<Explosivo>(
            `${this.apiBackend}/explosivo/${id}`,
            { withCredentials: true }
        ).toPromise();
    }

    //UPDATED EXPLOSIVO BY ID
    async updateExplosivo(id: string, payload: Partial<Explosivo>) {
        console.log(payload);
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/explosivo/${id}`,
            payload
        ).toPromise();
    }

    // DESACTIVAR EXPLOSIVO (SOFT DELETE)
    async deactivateExplosivo(id: string) {
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/explosivo/${id}/deactivate`,
            {},
            { withCredentials: true }
        ).toPromise();
    }

    async activateExplosivo(id: string) {
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/explosivo/${id}/activate`,
            {},
            { withCredentials: true }
        ).toPromise();
    }

}