import { Injectable, signal, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { BaseHttpService } from '../../../core/services/base-http.service';
import {
  PlanWithDetails,
  MarkChaptersReadRequest,
  MarkChaptersReadResponse
} from '../../plans/models/plan-model';

@Injectable({
  providedIn: 'root'
})
export class PlanDetailService {
  private readonly baseHttp = inject(BaseHttpService);

  // Signals para el estado
  private isLoading = signal<boolean>(false);
  private error = signal<string | null>(null);
  private currentPlan = signal<PlanWithDetails | null>(null);

  // Getters públicos para los signals
  public readonly loading = this.isLoading.asReadonly();
  public readonly errorMessage = this.error.asReadonly();
  public readonly plan = this.currentPlan.asReadonly();

  /**
   * Obtiene un plan específico por su ID con todos los detalles
   * @param planId - ID del plan
   * @returns Observable con el plan detallado
   */
  getPlanById(planId: number): Observable<PlanWithDetails> {
    this.setLoading(true);
    this.clearError();

    return this.baseHttp.get<PlanWithDetails>(`/plan/${planId}`).pipe(
      tap((plan) => {
        this.setLoading(false);
        this.currentPlan.set(plan);
        console.log('Plan detallado obtenido:', plan);
      }),
      catchError(error => {
        this.handleError('Error al obtener el plan detallado');
        return throwError(() => error);
      })
    );
  }

  /**
   * Marca capítulos como leídos
   * @param planId - ID del plan
   * @param request - Datos para marcar como leído
   * @returns Observable con la respuesta
   */
  markChaptersAsRead(
    planId: number,
    request: MarkChaptersReadRequest
  ): Observable<MarkChaptersReadResponse> {
    this.setLoading(true);
    this.clearError();

    return this.baseHttp.post<MarkChaptersReadResponse>(
      `/plan/${planId}/chapters/mark-read`,
      request
    ).pipe(
      tap((response) => {
        this.setLoading(false);
        console.log('Capítulos marcados como leídos:', response);

        // Actualizar el plan actual si existe
        const currentPlan = this.currentPlan();
        if (currentPlan) {
          this.updatePlanProgress(currentPlan, response);
        }
      }),
      catchError(error => {
        this.handleError('Error al marcar capítulos como leídos');
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza el progreso del plan actual
   */
  private updatePlanProgress(
    plan: PlanWithDetails,
    response: MarkChaptersReadResponse
  ): void {
    // Actualizar el progreso del plan
    const updatedPlan = {
      ...plan,
      progreso_porcentaje: response.nuevoProgreso
    };

    // Actualizar los detalles marcados como leídos
    updatedPlan.detalleplanlectura = plan.detalleplanlectura.map(detalle => {
      const updatedDetail = response.detallesActualizados.find(
        updated => updated.id_detalle === detalle.id_detalle
      );

      if (updatedDetail) {
        return {
          ...detalle,
          leido: updatedDetail.leido,
          fecha_completado: updatedDetail.fecha_completado,
          tiempo_real_minutos: updatedDetail.tiempo_real_minutos
        };
      }

      return detalle;
    });

    this.currentPlan.set(updatedPlan);
  }

  /**
   * Limpia el estado del servicio
   */
  clearState(): void {
    this.currentPlan.set(null);
    this.clearError();
    this.setLoading(false);
  }

  // Métodos privados de utilidad
  private setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  private clearError(): void {
    this.error.set(null);
  }

  private handleError(message: string): void {
    this.setLoading(false);
    this.error.set(message);
    console.error(message);
  }
}
