import { Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { CreatePlanRequest, CreatePlanResponse, Plan, UpdatePlanRequest } from '../models/plan-model';
import { ApiResponse } from '../../../auth/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private _isLoading = signal<boolean>(false);
  public readonly isLoading = this._isLoading.asReadonly();

  private _error = signal<string | null>(null);
  public readonly error = this._error.asReadonly();

  private _lastCreatedPlan = signal<Plan | null>(null);
  public readonly lastCreatedPlan = this._lastCreatedPlan.asReadonly();

  constructor(private baseHttp: BaseHttpService) {}

  /**
   * Crea un nuevo plan de lectura
   * @param planData - Datos del plan a crear
   * @returns Observable con la respuesta del servidor
   */
  createPlan(planData: CreatePlanRequest): Observable<CreatePlanResponse> {
    this.setLoading(true);
    this.clearError();

    return this.baseHttp.post<ApiResponse<CreatePlanResponse>>(
      '/plan/createPlan',
      planData
    ).pipe(
      map(response => response.data),
      tap(planResponse => {
        this.setLoading(false);
        this._lastCreatedPlan.set(planResponse.plan);
        console.log('Plan creado exitosamente:', planResponse);
      }),
      catchError(error => {
        this.handleError('Error al crear el plan de lectura');
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene todos los planes del usuario
   * @param userId - ID del usuario
   * @returns Observable con la lista de planes
   */
  getUserPlans(userId: number): Observable<Plan[]> {
    this.setLoading(true);
    this.clearError();

    return this.baseHttp.get<Plan[]>(
      `/plan/user/${userId}`
    ).pipe(
      tap((plans) => {
        this.setLoading(false);
        console.log('Planes del usuario obtenidos:', plans);
      }),
      catchError(error => {
        this.handleError('Error al obtener los planes del usuario');
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene un plan específico por ID
   * @param planId - ID del plan
   * @returns Observable con el plan
   */
  getPlanById(planId: number): Observable<Plan> {
    this.setLoading(true);
    this.clearError();

    return this.baseHttp.get<ApiResponse<Plan>>(
      `/plan/${planId}`
    ).pipe(
      map(response => response.data),
      tap(() => {
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al obtener el plan');
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza un plan existente
   * @param planId - ID del plan a actualizar
   * @param planData - Datos actualizados del plan
   * @returns Observable con el plan actualizado
   */
  updatePlan(planId: number, planData: UpdatePlanRequest): Observable<Plan> {
    this.setLoading(true);
    this.clearError();

    console.log('PlanService - Actualizando plan:', planId, planData);

    return this.baseHttp.put<ApiResponse<Plan>>(
      `/plan/${planId}`,
      planData
    ).pipe(
      map(response => {
        console.log('PlanService - Respuesta del servidor:', response);
        return response.data;
      }),
      tap((plan) => {
        this.setLoading(false);
        console.log('PlanService - Plan actualizado exitosamente:', plan);
      }),
      catchError(error => {
        console.error('PlanService - Error al actualizar:', error);
        this.handleError('Error al actualizar el plan');
        return throwError(() => error);
      })
    );
  }

  /**
   * Elimina un plan
   * @param planId - ID del plan a eliminar
   * @returns Observable con la confirmación
   */
  deletePlan(planId: number): Observable<any> {
    this.setLoading(true);
    this.clearError();

    console.log('PlanService - Eliminando plan:', planId);

    return this.baseHttp.delete<ApiResponse<any>>(
      `/plan/${planId}`
    ).pipe(
      map(response => {
        console.log('PlanService - Respuesta de eliminación:', response);
        return response.data;
      }),
      tap(() => {
        this.setLoading(false);
        console.log('PlanService - Plan eliminado exitosamente');
      }),
      catchError(error => {
        console.error('PlanService - Error al eliminar:', error);
        this.handleError('Error al eliminar el plan');
        return throwError(() => error);
      })
    );
  }

  /**
   * Limpia el error actual
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Limpia el último plan creado
   */
  clearLastCreatedPlan(): void {
    this._lastCreatedPlan.set(null);
  }

  // Métodos privados de utilidad

  private setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  private handleError(message: string): void {
    this.setLoading(false);
    this._error.set(message);
    console.error(message);
  }
}
