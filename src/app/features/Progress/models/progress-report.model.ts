export interface PerfilLectura {
  nivelLectura: number;
  tiempoLecturaDiario: number;
  horaPreferida: string;
  incluirFinesSemana: boolean;
  autoAjustePlan: boolean;
}

export interface ResumenLibros {
  totalLibros: number;
  librosEnProgreso: number;
  librosCompletados: number;
  totalPlanes: number;
  planesActivos: number;
  planesCompletados: number;
  planesPausados: number;
}

export interface EstadisticasProgreso {
  totalCapitulos: number;
  capitulosLeidos: number;
  capitulosPendientes: number;
  porcentajeProgreso: number;
  paginasLeidas: number;
  tiempoTotalInvertido: number;
}

export interface AnalisisCumplimiento {
  diasPlanificados: number;
  diasCompletados: number;
  diasAtrasados: number;
  diasAdelantados: number;
  porcentajeCumplimiento: number;
  tendencia: 'POSITIVA' | 'NEGATIVA' | 'NEUTRAL';
}

export interface LibroEnProgreso {
  titulo: string;
  autor: string;
  progreso: number;
  capitulosLeidos: number;
  capitulosTotales: number;
  fechaInicio: string;
  diasTranscurridos: number;
  estado: string;
}

export interface ProgressReport {
  perfilLectura: PerfilLectura;
  resumenLibros: ResumenLibros;
  estadisticasProgreso: EstadisticasProgreso;
  analisisCumplimiento: AnalisisCumplimiento;
  librosEnProgreso: LibroEnProgreso[];
}

