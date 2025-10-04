import {
  Component,
  inject,
  signal,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanCardDetailComponent } from '../plan-card-detail/plan-card-detail.component';
import { PlanDetailService } from '../../services/plan-detail.service';
import {
  PlanWithDetails,
  PlanDetail,
  MarkChaptersReadRequest,
} from '../../../plans/models/plan-model';
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
  selector: 'app-plan-card-detail-list',
  imports: [
    CommonModule,
    MatExpansionModule,
    PlanCardDetailComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatChipsModule,
    MatCardModule,
    MatProgressBar
],
  templateUrl: './plan-card-detail-list.component.html',
})
export class PlanCardDetailListComponent implements OnInit {
  // Inputs
  @Input() planId: number | null = null;

  // Outputs
  @Output() planDetailSelected = new EventEmitter<PlanDetail>();
  @Output() chapterMarkedAsRead = new EventEmitter<{
    planDetail: PlanDetail;
    tiempoRealMinutos: number;
    dificultadPercibida: number;
    notas: string;
  }>();

  // Servicios inyectados
  private planDetailService = inject(PlanDetailService);
  private snackBar = inject(MatSnackBar);

  // Signals para el estado del componente
  planWithDetails = signal<PlanWithDetails | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    if (this.planId) {
      this.loadPlanDetails();
    }
  }

  /**
   * Carga los detalles del plan específico
   */
  private loadPlanDetails(): void {
    if (!this.planId) {
      this.error.set('ID de plan no proporcionado');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.planDetailService.getPlanById(this.planId).subscribe({
      next: (plan) => {
        this.planWithDetails.set(plan);
        this.isLoading.set(false);
        console.log('Plan con detalles cargado:', plan);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.error.set('Error al cargar el plan');
        this.snackBar.open('Error al cargar los detalles del plan', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        console.error('Error al cargar plan:', error);
      },
    });
  }

  /**
   * Maneja la selección de un detalle del plan
   */
  onPlanDetailSelected(planDetail: PlanDetail): void {
    console.log('Detalle del plan seleccionado:', planDetail);
    this.planDetailSelected.emit(planDetail);
  }

  /**
   * Maneja el marcado de capítulos como leídos
   */
  onMarkAsRead(event: {
    planDetail: PlanDetail;
    tiempoRealMinutos: number;
    dificultadPercibida: number;
    notas: string;
  }): void {
    if (!this.planId) return;

    const request: MarkChaptersReadRequest = {
      detalleIds: [event.planDetail.id_detalle],
      tiempoRealMinutos: event.tiempoRealMinutos,
      dificultadPercibida: event.dificultadPercibida,
      notas: event.notas,
    };

    this.planDetailService.markChaptersAsRead(this.planId, request).subscribe({
      next: (response) => {
        this.snackBar.open(response.data.mensaje, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });

        this.chapterMarkedAsRead.emit(event);

        this.loadPlanDetails();
      },
      error: (error) => {
        this.snackBar.open('Error al marcar capítulo como leído', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        console.error('Error al marcar como leído:', error);
      },
    });
  }

  roundProgress(progress : number) : number {
    return Math.round(progress);
  }

  /**
   * Recarga los detalles del plan
   */
  refreshPlan(): void {
    this.loadPlanDetails();
  }

  /**
   * Verifica si hay detalles del plan para mostrar
   */
  hasPlanDetails(): boolean {
    const plan = this.planWithDetails();
    return plan !== null && plan.detalleplanlectura.length > 0;
  }

  /**
   * Obtiene los detalles del plan agrupados por día
   */
  getPlanDetailsByDay(): { [day: number]: PlanDetail[] } {
    const plan = this.planWithDetails();
    if (!plan) return {};

    return plan.detalleplanlectura.reduce((acc, detail) => {
      if (!acc[detail.dia]) {
        acc[detail.dia] = [];
      }
      acc[detail.dia].push(detail);
      return acc;
    }, {} as { [day: number]: PlanDetail[] });
  }

  /**
   * Obtiene los días únicos del plan
   */
  getPlanDays(): number[] {
    const detailsByDay = this.getPlanDetailsByDay();
    return Object.keys(detailsByDay)
      .map((day) => parseInt(day))
      .sort((a, b) => a - b);
  }


  /**
   * Obtiene el estado del día (completado, en progreso, pendiente, atrasado)
   */
  getDayStatus(
    day: number
  ): 'completed' | 'in-progress' | 'pending' | 'overdue' {
    const details = this.getPlanDetailsByDay()[day] || [];

    if (details.length === 0) return 'pending';

    const allRead = details.every((d) => d.leido);
    const someRead = details.some((d) => d.leido);
    const anyOverdue = details.some((d) => d.es_atrasado);

    if (allRead) return 'completed';
    if (anyOverdue) return 'overdue';
    if (someRead) return 'in-progress';
    return 'pending';
  }


  /**
   * Obtiene el texto del estado del día
   */
  getDayStatusText(day: number): string {
    const status = this.getDayStatus(day);
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En progreso';
      case 'overdue':
        return 'Atrasado';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Pendiente';
    }
  }

}
