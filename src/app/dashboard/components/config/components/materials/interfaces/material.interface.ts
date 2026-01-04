export interface Material {
    id: string
    nombre: string
    descripcion: string
    unidad: 'unidad' | 'metros' | 'sacos' | 'kg'
}