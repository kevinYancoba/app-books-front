import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Plan } from '../../models/plan-model';


@Component({
  selector: 'app-plan-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  templateUrl: './plan-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanCardComponent {
  plan = input<Plan | null>(null);
  compact = input<boolean>(false);
  viewPlan = output<Plan>();
  editPlan = output<Plan>();
  completePlan = output<Plan>();
  deletePlan = output<Plan>();

  progressPercentage = computed(() => {
    const plan = this.plan();
    if (!plan?.estadisticas) return 0;
    const { paginasLeidas, totalPaginas } = plan.estadisticas;
    return totalPaginas > 0 ? Math.round((paginasLeidas / totalPaginas) * 100) : 0;
  });

  daysRemaining = computed(() => {
    const plan = this.plan();
    if (!plan?.estadisticas) return 0;
    return Math.max(0, plan.estadisticas.diasRestantes);
  });

  isOverdue = computed(() => {
    const plan = this.plan();
    return plan ? plan.dias_atrasado > 0 : false;
  });

  statusColor = computed(() => {
    const plan = this.plan();
    if (!plan) return 'primary';

    if (this.isOverdue()) return 'warn';
    if (this.progressPercentage() >= 80) return 'primary';
    if (this.progressPercentage() >= 50) return 'accent';
    return 'primary';
  });

  onView(p: Plan) {
    this.viewPlan.emit(p);
  }

  onEdit(p: Plan) {
    this.editPlan.emit(p);
  }

  onComplete(p: Plan) {
    this.completePlan.emit(p);
  }

  onDelete(p: Plan) {
    this.deletePlan.emit(p);
  }

  /**
   * Obtiene el progreso para mostrar en la barra
   */
  getDisplayProgress(p: Plan): number {
    const progress = p.progreso_porcentaje ?? 0;
    if (progress < 0) return 0;
    if (progress > 100) return 100;
    return Math.round(progress);
  }

  /**
   * Obtiene el icono según el estado del plan
   */
  getStatusIcon(plan: Plan): string {
    switch (plan.estado) {
      case 'ACTIVO':
        return 'play_circle';
      case 'COMPLETADO':
        return 'check_circle';
      case 'PAUSADO':
        return 'pause_circle';
      case 'CANCELADO':
        return 'cancel';
      default:
        return 'book';
    }
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Obtiene el color del estado
   */
  getStateColor(estado: string): string {
    switch (estado) {
      case 'ACTIVO':
        return 'primary';
      case 'COMPLETADO':
        return 'accent';
      case 'PAUSADO':
        return 'warn';
      case 'CANCELADO':
        return 'warn';
      default:
        return 'primary';
    }
  }
}
