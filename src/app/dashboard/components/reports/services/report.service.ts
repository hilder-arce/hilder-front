import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Reporte } from "../interfaces/report.interface";
import { environment } from "../../../../../environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    private readonly apiBackend = environment.apiUrl;
    private readonly draftStorageKey = 'reportes_borradores';
    private readonly equipoStorageKey = 'reportes_equipos';
    private readonly explosivoStorageKey = 'reportes_explosivos';
    private readonly materialStorageKey = 'reportes_materiales';

    constructor(private http: HttpClient) {}

    // ==================== MÉTODOS PARA BACKEND ====================

    // CREAR REPORTE (ENVIAR AL BACKEND)
    async createReport(newReport: Reporte) {
        return await this.http.post<{ message: string }>(
            `${this.apiBackend}/reportes`, 
            newReport,
            { withCredentials: true }
        ).toPromise();
    }

    // OBTENER TODOS LOS REPORTES DEL BACKEND
    async getReports() {
        return await this.http.get<Reporte[]>(
            `${this.apiBackend}/reportes`,
            { withCredentials: true }
        ).toPromise();
    }

    // OBTENER REPORTE POR ID DEL BACKEND
    async getReportById(id: string) {
        return await this.http.get<Reporte>(
            `${this.apiBackend}/reportes/${id}`,
            { withCredentials: true }
        ).toPromise();
    }

    // ACTUALIZAR REPORTE EN BACKEND
    async updateReport(id: string, payload: Partial<Reporte>) {
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/reportes/${id}`,
            payload,
            { withCredentials: true }
        ).toPromise();
    }

    // DESACTIVAR REPORTE EN BACKEND
    async deactivateReport(id: string) {
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/reportes/${id}/deactivate`,
            {},
            { withCredentials: true }
        ).toPromise();
    }

    // ACTIVAR REPORTE EN BACKEND
    async activateReport(id: string) {
        return await this.http.patch<{ message: string }>(
            `${this.apiBackend}/reportes/${id}/activate`,
            {},
            { withCredentials: true }
        ).toPromise();
    }

    // ==================== MÉTODOS PARA BORRADORES (LOCALSTORAGE) ====================

    // OBTENER TODOS LOS BORRADORES DEL LOCALSTORAGE
    async getDrafts(): Promise<Reporte[]> {
        try {
            return this.getAllDrafts();
        } catch (error) {
            console.error('Error al obtener borradores:', error);
            return [];
        }
    }

    // OBTENER UN BORRADOR ESPECÍFICO DEL LOCALSTORAGE
    async getDraft(id: string): Promise<Reporte | undefined> {
        try {
            const drafts = this.getAllDrafts();
            return drafts.find(d => d.id === id);
        } catch (error) {
            console.error('Error al obtener borrador:', error);
            return undefined;
        }
    }

    // ELIMINAR UN BORRADOR DEL LOCALSTORAGE
    async deleteDraft(id: string): Promise<boolean> {
        try {
            const drafts = this.getAllDrafts();
            const filtered = drafts.filter(d => d.id !== id);
            localStorage.setItem(this.draftStorageKey, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error al eliminar borrador:', error);
            return false;
        }
    }

    // GUARDAR REPORTE DEFINITIVAMENTE (ENVÍA AL BACKEND)
    async saveReport(report: Reporte) {
        try {
            // Primero elimina el borrador si existe
            if (report.id) {
                await this.deleteDraft(report.id);
            }
            
            // Luego envía al backend
            const response = await this.createReport(report);
            
            // Limpiar los datos de equipos, explosivos y materiales
            this.limpiarDatosTemporales();
            
            return response;
        } catch (error) {
            console.error('Error al guardar reporte:', error);
            throw error;
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    // OBTENER TODOS LOS BORRADORES DEL LOCALSTORAGE (PRIVADO)
    private getAllDrafts(): Reporte[] {
        try {
            const data = localStorage.getItem(this.draftStorageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al parsear borradores:', error);
            return [];
        }
    }

    // GENERAR ID ÚNICO (PRIVADO)
    private generateId(): string {
        return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // LIMPIAR DATOS TEMPORALES DE EQUIPOS, EXPLOSIVOS Y MATERIALES (PRIVADO)
    private limpiarDatosTemporales(): void {
        try {
            localStorage.removeItem(this.equipoStorageKey);
            localStorage.removeItem(this.explosivoStorageKey);
            localStorage.removeItem(this.materialStorageKey);
            console.log('Datos temporales de equipos, explosivos y materiales limpiados');
        } catch (error) {
            console.error('Error al limpiar datos temporales:', error);
        }
    }
}
