export interface Plan {
  id_plan: number;
  id: number;
  id_libro: number;
  id_perfil: number;
  fecha_inicio: string;
  fecha_fin: string;
  generado_por_ia: boolean;
  descripcion: string | null;
  created_at: string;
  dias_atrasado: number;
  es_personalizado: boolean;
  estado: 'ACTIVO' | 'COMPLETADO' | 'PAUSADO' | 'CANCELADO';
  fecha_fin_original: string;
  incluir_fines_semana: boolean;
  paginas_por_dia: number | null;
  progreso_porcentaje: number;
  tiempo_estimado_dia: number | null;
  titulo: string;
  updated_at: string | null;
  libro: BookInfo;
  estadisticas: PlanStatistics;
}

export interface BookInfo {
  id_libro: number;
  titulo: string;
  autor: string;
}

export interface PlanStatistics {
  totalCapitulos: number;
  capitulosCompletados: number;
  totalPaginas: number;
  paginasLeidas: number;
  diasTranscurridos: number;
  diasRestantes: number;
}

export interface CreatePlanRequest {
  idUsuario: number;
  nivelLectura: string;
  tiempoLecturaDiario: number;
  horaioLectura: string;
  fechaFin: string;
  finesSemana: boolean;
  tituloLibro: string;
  autorLibro: string;
  indiceBase64: string;
}

export interface CreatePlanResponse {
  id: number;
  message: string;
  plan: Plan;
}

// Alias para compatibilidad con plan-detail
export type PlanDetailed = Plan;
