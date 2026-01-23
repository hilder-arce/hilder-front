import { Injectable } from "@angular/core";
import { ReporteEquipo } from "../interfaces/equipo.interface";

@Injectable({
    providedIn: 'root'
})
export class EquipoReportService {

    private readonly STORAGE_KEY = 'reportes_equipos';

    /**
     * Obtener todos los reportes de equipos del localStorage
     */
    obtenerEquipos(): ReporteEquipo[] {
        try {
            const datos = localStorage.getItem(this.STORAGE_KEY);
            return datos ? JSON.parse(datos) : [];
        } catch (error) {
            console.error('Error al obtener equipos del localStorage:', error);
            return [];
        }
    }

    /**
     * Obtener un reporte de equipo por ID
     */
    obtenerEquipoPorId(equipoId: string): ReporteEquipo | null {
        const equipos = this.obtenerEquipos();
        return equipos.find(e => e.equipoId === equipoId) || null;
    }

    /**
     * Crear/guardar un nuevo reporte de equipo
     */
    crearEquipo(equipo: ReporteEquipo): boolean {
        try {
            const equipos = this.obtenerEquipos();
            
            // Verificar si el ID ya existe
            if (equipos.some(e => e.equipoId === equipo.equipoId)) {
                console.warn('El equipo con este ID ya existe');
                return false;
            }
            
            equipos.push(equipo);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(equipos));
            return true;
        } catch (error) {
            console.error('Error al crear equipo:', error);
            return false;
        }
    }

    /**
     * Actualizar un reporte de equipo existente
     */
    actualizarEquipo(equipoId: string, equipoActualizado: ReporteEquipo): boolean {
        try {
            const equipos = this.obtenerEquipos();
            const index = equipos.findIndex(e => e.equipoId === equipoId);
            
            if (index === -1) {
                console.warn('Equipo no encontrado');
                return false;
            }
            
            equipos[index] = equipoActualizado;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(equipos));
            return true;
        } catch (error) {
            console.error('Error al actualizar equipo:', error);
            return false;
        }
    }

    /**
     * Eliminar un reporte de equipo
     */
    eliminarEquipo(equipoId: string): boolean {
        try {
            const equipos = this.obtenerEquipos();
            const equiposFiltrados = equipos.filter(e => e.equipoId !== equipoId);
            
            if (equiposFiltrados.length === equipos.length) {
                console.warn('Equipo no encontrado para eliminar');
                return false;
            }
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(equiposFiltrados));
            return true;
        } catch (error) {
            console.error('Error al eliminar equipo:', error);
            return false;
        }
    }

    /**
     * Limpiar todos los reportes de equipos
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
