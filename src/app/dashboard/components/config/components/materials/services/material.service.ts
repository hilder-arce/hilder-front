import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../../../environments/environment.prod";
import { Material } from "../interfaces/material.interface";

@Injectable({
    providedIn: 'root'
})
export class MaterialService {

    private readonly apiBackend = environment.apiUrl;

    constructor(private http: HttpClient) {}

    // CREAR MATERIAL
    async createMaterial(newMaterial: Material) {
        return await this.http.post<{ message: string }>(
            `${this.apiBackend}/material`, 
            newMaterial,
            { withCredentials: true }
        ).toPromise();
    }

    // OBTENER TODOS LOS MATERIALES
    async getMateriales() {
        return await this.http.get<Material[]>(
            `${this.apiBackend}/material`,
            { withCredentials: true }
        ).toPromise();
    }

    // OBTENER MATERIAL POR ID
    async getMaterialById(id: string) {
        return await this.http.get<Material>(
            `${this.apiBackend}/material/${id}`,
            { withCredentials: true }
        ).toPromise();
    }

    // ACTUALIZAR MATERIAL
    async updateMaterial(id: string, payload: Partial<Material>) {
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/material/${id}`,
            payload,
            { withCredentials: true }
        ).toPromise();
    }

    // DESACTIVAR MATERIAL (SOFT DELETE)
    async deactivateMaterial(id: string) {
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/material/${id}/deactivate`,
            {},
            { withCredentials: true }
        ).toPromise();
    }

    async activateMaterial(id: string) {
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/material/${id}/activate`,
            {},
            { withCredentials: true }
        ).toPromise();
    }
}