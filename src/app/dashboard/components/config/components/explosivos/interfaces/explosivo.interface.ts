export interface Explosivo {
    id: string
    nombre: string
    tipo:
    | 'EMULSION'
    | 'DINAMITA'
    | 'CORDON_DETONANTE'
    | 'DETONADOR';

    presentacion:
    | 'CARTUCHO'
    | 'GRANEL'
    | 'ROLLO'
    | 'UNIDAD';

    unidadMedida:
    | 'CARTUCHOS'
    | 'KILOGRAMOS'
    | 'METROS'
    | 'UNIDADES';

    descripcion?: string;
}