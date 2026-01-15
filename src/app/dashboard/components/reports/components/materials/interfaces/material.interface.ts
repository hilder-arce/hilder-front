export interface ReporteMaterial {
  materialId: string;
  materialNombre: string;

  stockInicial: number;

  ingreso: number;
  consumo: number;

  stockFinal: number;   // calculado

  unidad: 'KG' | 'UND' | 'M3';

  observacion?: string;
}
