export interface Plan {
  id: number;
  titulo: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  progreso?: number;
  paginasTotales?: number;
  paginaActual?: number;
  portadaUrl?: string;
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
