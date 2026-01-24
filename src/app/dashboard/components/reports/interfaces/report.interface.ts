import { ReporteEquipo } from "../components/equipos/interfaces/equipo.interface";
import { ReporteExplosivo } from "../components/explosivos/interfaces/explosivo.interface";
import { ReporteMaterial } from "../components/materials/interfaces/material.interface";

export interface Reporte {
  _id?: string;
  id?: string;

  fecha: string;               // YYYY-MM-DD
  turno: 'DIA' | 'NOCHE';
  nivel?: '2750' | '2360';     // Nivel de profundidad

  responsable: string;
  equipos: ReporteEquipo[];
  explosivos: ReporteExplosivo[];
  materiales: ReporteMaterial[];

  observacionesGenerales?: string;

  estado: 'BORRADOR' | 'ENVIADO' | 'APROBADO';

  createdAt?: string;
  updatedAt?: string;
}
