export interface ReporteExplosivo {
  explosivoId: string;
  nombre: string;

  tipo: TipoExplosivo;

  stockInicial: number;

  ingreso: number;
  consumo: number;

  stockFinal: number;   // calculado

  unidad: UnidadMedidaExplosivo;

  observacionesOperativas?: string;
}

export type TipoExplosivo =
  | 'EMULSION'
  | 'DINAMITA'
  | 'CORDON_DETONANTE'
  | 'DETONADOR';

export type UnidadMedidaExplosivo =
  | 'CARTUCHOS'
  | 'KILOGRAMOS'
  | 'METROS'
  | 'UNIDADES';
