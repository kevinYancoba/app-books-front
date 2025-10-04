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
  estadisticas?: PlanStatistics; // Opcional porque no siempre viene en todas las respuestas
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

// Request para actualizar un plan
export interface UpdatePlanRequest {
  titulo?: string;
  descripcion?: string;
  fechaFin?: string;
  incluirFinesSemana?: boolean;
  paginasPorDia?: number;
  tiempoEstimadoDia?: number;
}

// Interfaces para plan detallado con capítulos
export interface PlanWithDetails extends Plan {
  detalleplanlectura: PlanDetail[];
}

export interface PlanDetail {
  id_detalle: number;
  id_plan: number;
  id_capitulo: number;
  fecha_asignada: string;
  leido: boolean;
  tiempo_estimado_minutos: number;
  pagina_inicio: number;
  pagina_fin: number;
  dia: number;
  created_at: string;
  dificultad_percibida: number | null;
  es_atrasado: boolean;
  fecha_completado: string | null;
  notas: string | null;
  tiempo_real_minutos: number | null;
  updated_at: string | null;
  capitulo: Chapter;
}

export interface Chapter {
  id_capitulo: number;
  numero_capitulo: number;
  titulo_capitulo: string;
  paginas_estimadas: number;
}

// Request para marcar capítulos como leídos
export interface MarkChaptersReadRequest {
  detalleIds: number[];
  tiempoRealMinutos: number;
  dificultadPercibida: number;
  notas: string;
}

// Response al marcar capítulos como leídos
export interface MarkChaptersReadResponse {
  statusCode: number;
  message: string;
  data: MarkChaptersReadData;
}

export interface MarkChaptersReadData {
  mensaje: string;
  capitulosMarcados: number;
  nuevoProgreso: number;
  detallesActualizados: UpdatedDetail[];
}

export interface UpdatedDetail {
  id_detalle: number;
  leido: boolean;
  fecha_completado: string;
  tiempo_real_minutos: number;
  notas?: string;
}

// Alias para compatibilidad con plan-detail
export type PlanDetailed = Plan;
