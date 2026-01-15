export interface ReporteEquipo {
  equipoId: string;
  equipoNombre: string;

  horometroInicial: number;
  horometroFinal: number;

  horasTrabajadas: number;   // calculado
  combustibleGalones: number;

  estado: 'OPERATIVO' | 'MANTENIMIENTO';

  observacion?: string;
}
