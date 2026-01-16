export interface ReporteMaterial {
  materialId: string;
  materialNombre: string;

  stockInicial: number;

  ingreso: number;
  consumo: number;

  stockFinal: number;   // calculado

  unidad: 'unidad' | 'metros' | 'sacos' | 'kg';

  observacion?: string;
}
