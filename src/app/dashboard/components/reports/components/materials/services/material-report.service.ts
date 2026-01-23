import { Injectable } from '@angular/core';
import { ReporteMaterial } from '../interfaces/material.interface';

@Injectable({
    providedIn: 'root'
})
export class MaterialReportService {

    private readonly STORAGE_KEY = 'reportes_materiales';

    /**
     * Obtener todos los reportes de materiales del localStorage
     */
    obtenerMateriales(): ReporteMaterial[] {
        try {
            const datos = localStorage.getItem(this.STORAGE_KEY);
            return datos ? JSON.parse(datos) : [];
        } catch (error) {
            console.error('Error al obtener materiales:', error);
            return [];
        }
    }

    /**
     * Obtener un material por ID
     */
    obtenerMaterialPorId(materialId: string): ReporteMaterial | null {
        const materiales = this.obtenerMateriales();
        return materiales.find(m => m.materialId === materialId) || null;
    }

    /**
     * Crear un nuevo reporte de material
     */
    crearMaterial(material: ReporteMaterial): boolean {
        try {
            const materiales = this.obtenerMateriales();
            
            // Prevenir duplicados
            const existe = materiales.some(m => m.materialId === material.materialId);
            if (existe) {
                console.warn('El material ya existe');
                return false;
            }

            materiales.push(material);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(materiales));
            return true;
        } catch (error) {
            console.error('Error al crear material:', error);
            return false;
        }
    }

    /**
     * Actualizar un reporte de material
     */
    actualizarMaterial(materialId: string, material: ReporteMaterial): boolean {
        try {
            const materiales = this.obtenerMateriales();
            const index = materiales.findIndex(m => m.materialId === materialId);
            
            if (index === -1) {
                console.warn('Material no encontrado');
                return false;
            }

            materiales[index] = material;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(materiales));
            return true;
        } catch (error) {
            console.error('Error al actualizar material:', error);
            return false;
        }
    }

    /**
     * Eliminar un reporte de material
     */
    eliminarMaterial(materialId: string): boolean {
        try {
            const materiales = this.obtenerMateriales();
            const filtered = materiales.filter(m => m.materialId !== materialId);
            
            if (filtered.length === materiales.length) {
                console.warn('Material no encontrado');
                return false;
            }

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error al eliminar material:', error);
            return false;
        }
    }

    /**
     * Limpiar todos los reportes
     */
    limpiarTodos(): boolean {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error al limpiar datos:', error);
            return false;
        }
    }
}
