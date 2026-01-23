import { ReporteEquipo } from "../components/equipos/interfaces/equipo.interface";
import { ReporteExplosivo } from "../components/explosivos/interfaces/explosivo.interface";
import { ReporteMaterial } from "../components/materials/interfaces/material.interface";

export interface Reporte {
  id?: string;

  fecha: string;               // YYYY-MM-DD
  turno: 'DIA' | 'NOCHE';

  responsable: string;
  equipos: ReporteEquipo[];
  explosivos: ReporteExplosivo[];
  materiales: ReporteMaterial[];

  observacionesGenerales?: string;

  estado: 'BORRADOR' | 'ENVIADO' | 'APROBADO';

  createdAt?: string;
  updatedAt?: string;
}
