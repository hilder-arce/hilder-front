import { Injectable } from '@angular/core';
import { ReporteExplosivo } from '../interfaces/explosivo.interface';

@Injectable({
    providedIn: 'root'
})
export class ExplosivoReportService {

    private readonly STORAGE_KEY = 'reportes_explosivos';

    /**
     * Obtener todos los reportes de explosivos del localStorage
     */
    obtenerExplosivos(): ReporteExplosivo[] {
        try {
            const datos = localStorage.getItem(this.STORAGE_KEY);
            return datos ? JSON.parse(datos) : [];
        } catch (error) {
            console.error('Error al obtener explosivos:', error);
            return [];
        }
    }

    /**
     * Obtener un explosivo por ID
     */
    obtenerExplosivoPorId(explosivoId: string): ReporteExplosivo | null {
        const explosivos = this.obtenerExplosivos();
        return explosivos.find(e => e.explosivoId === explosivoId) || null;
    }

    /**
     * Crear un nuevo reporte de explosivo
     */
    crearExplosivo(explosivo: ReporteExplosivo): boolean {
        try {
            const explosivos = this.obtenerExplosivos();
            
            // Prevenir duplicados
            const existe = explosivos.some(e => e.explosivoId === explosivo.explosivoId);
            if (existe) {
                console.warn('El explosivo ya existe');
                return false;
            }

            explosivos.push(explosivo);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(explosivos));
            return true;
        } catch (error) {
            console.error('Error al crear explosivo:', error);
            return false;
        }
    }

    /**
     * Actualizar un reporte de explosivo
     */
    actualizarExplosivo(explosivoId: string, explosivo: ReporteExplosivo): boolean {
        try {
            const explosivos = this.obtenerExplosivos();
            const index = explosivos.findIndex(e => e.explosivoId === explosivoId);
            
            if (index === -1) {
                console.warn('Explosivo no encontrado');
                return false;
            }

            explosivos[index] = explosivo;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(explosivos));
            return true;
        } catch (error) {
            console.error('Error al actualizar explosivo:', error);
            return false;
        }
    }

    /**
     * Eliminar un reporte de explosivo
     */
    eliminarExplosivo(explosivoId: string): boolean {
        try {
            const explosivos = this.obtenerExplosivos();
            const filtered = explosivos.filter(e => e.explosivoId !== explosivoId);
            
            if (filtered.length === explosivos.length) {
                console.warn('Explosivo no encontrado');
                return false;
            }

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error al eliminar explosivo:', error);
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
