export type TipoExplosivo =
  | 'EMULSION'
  | 'DINAMITA'
  | 'CORDON_DETONANTE'
  | 'DETONADOR';

export type PresentacionExplosivo =
  | 'CARTUCHO'
  | 'GRANEL'
  | 'ROLLO'
  | 'UNIDAD';

export type UnidadMedidaExplosivo =
  | 'CARTUCHOS'
  | 'KILOGRAMOS'
  | 'METROS'
  | 'UNIDADES';

export interface Explosivo {
  _id?: string;
  nombre: string;
  tipo: TipoExplosivo;
  presentacion: PresentacionExplosivo;
  unidadMedida: UnidadMedidaExplosivo;
  descripcion?: string;
  estado?: boolean;
  createdAt?: number;
  updatedAt?: number;
}
