export interface Material {
    
    _id?: string
    nombre: string
    descripcion: string
    unidad: 'unidad' | 'metros' | 'sacos' | 'kg'
    estado?: boolean
}