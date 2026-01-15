export interface ReporteExplosivo {
  explosivoId: string;
  nombre: string;

  tipo: 'EMULSION' | 'ANFO' | 'ACCESORIO';

  stockInicial: number;

  ingreso: number;
  consumo: number;

  stockFinal: number;   // calculado

  unidad: 'KG' | 'M';

  observacionesOperativas?: string;
}

