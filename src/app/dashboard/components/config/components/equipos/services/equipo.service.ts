import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../../../environments/environment.prod";
import { Equipo } from "../interfaces/equipo.interface";

@Injectable({
    providedIn: 'root'
})
export class EquipoService {

    private readonly apiBackend = environment.apiUrl;

    constructor(private http: HttpClient) {}

    // CREAR EQUIPO
    async createEquipo(newEquipo: Equipo) {
        return await this.http.post<{ message: string }>(
            `${this.apiBackend}/equipo`, 
            newEquipo,
            { withCredentials: true }
        ).toPromise();
    }

    // OBTENER TODOS LOS EQUIPOS
    async getEquipos() {
        return await this.http.get<Equipo[]>(
            `${this.apiBackend}/equipo`,
            { withCredentials: true }
        ).toPromise();
    }

    // OBTENER EQUIPO POR ID
    async getEquipoById(id: string) {
        return await this.http.get<Equipo>(
            `${this.apiBackend}/equipo/${id}`,
            { withCredentials: true }
        ).toPromise();
    }

    // ACTUALIZAR EQUIPO
    async updateEquipo(id: string, payload: Partial<Equipo>) {
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/equipo/${id}`,
            payload,
            { withCredentials: true }
        ).toPromise();
    }

    // DESACTIVAR EQUIPO (SOFT DELETE)
    async deactivateEquipo(id: string) {
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/equipo/${id}/deactivate`,
            {},
            { withCredentials: true }
        ).toPromise();
    }
}