import { ReporteEquipo } from "../components/equipos/interfaces/equipo.interface";

export interface ReporteTurno {
  id?: string;

  fecha: string;               // YYYY-MM-DD
  turno: 'DIA' | 'NOCHE';

  responsable: string;
  equipos: ReporteEquipo[];
  //explosivos: ReporteExplosivo[];
  //materiales: ReporteMaterial[];

  observacionesGenerales?: string;

  estado: 'BORRADOR' | 'ENVIADO' | 'APROBADO';

  createdAt?: string;
  updatedAt?: string;
}

//dto backend
export interface CreateReporteTurnoDto {
  fecha: string;
  turno: 'DIA' | 'NOCHE';

  responsableId: string;

  equipos: {
    equipoId: string;
    horometroInicial: number;
    horometroFinal: number;
    combustibleGalones: number;
    estado: 'OPERATIVO' | 'MANTENIMIENTO';
    observacion?: string;
  }[];

  materiales: {
    materialId: string;
    ingreso: number;
    consumo: number;
    observacion?: string;
  }[];

  explosivos: {
    explosivoId: string;
    ingreso: number;
    consumo: number;
    observacionesOperativas?: string;
  }[];

  observacionesGenerales?: string;
}

