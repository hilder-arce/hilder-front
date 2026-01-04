import { Equipo } from "../../config/components/equipos/interfaces/equipo.interface"
import { Explosivo } from "../../config/components/explosivos/interfaces/explosivo.interface"
import { Material } from "../../config/components/materials/interfaces/material.interface"

export interface Report {
    id: string
    fecha: string
    agente: string
    turno: 'dia' | 'noche'
    estado: 'borrador' | 'proceso' | 'completado'
    createdAt?: number
    updatedAt?: number
    explosivos: Explosivo[]
    equipos: Equipo[]
    materiales: Material[]
}