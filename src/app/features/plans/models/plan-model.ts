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
