import { Equipo } from "./equipo.interface"
import { Explosivo } from "./explosivo.interface"
import { Material } from "./material.interface"

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