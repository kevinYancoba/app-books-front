import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatChipsModule } from "@angular/material/chips";
import { DatePipe } from "@angular/common";
import { PlanDetailed } from '../../../plans/models/plan-model';

@Component({
  selector: 'app-plan-card-detail',
  imports: [
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  templateUrl: './plan-card-detail.component.html',
  styleUrl: './plan-card-detail.component.scss'
})
export class PlanCardDetailComponent {
  @Input({ required: true }) plan!: PlanDetailed;
  @Output() planSelected = new EventEmitter<PlanDetailed>();
  @Output() planCompleted = new EventEmitter<{ plan: PlanDetailed, completed: boolean }>();

  // Signal para el estado del checkbox
  isCompleted = signal<boolean>(false);

  // Computed signals para datos derivados
  progressPercentage = computed(() => {
    if (!this.plan?.estadisticas) return 0;
    const { paginasLeidas, totalPaginas } = this.plan.estadisticas;
    return totalPaginas > 0 ? Math.round((paginasLeidas / totalPaginas) * 100) : 0;
  });

  daysRemaining = computed(() => {
    if (!this.plan?.estadisticas) return 0;
    return Math.max(0, this.plan.estadisticas.diasRestantes);
  });

  isOverdue = computed(() => {
    return this.plan?.dias_atrasado > 0;
  });

  statusColor = computed(() => {
    if (this.isOverdue()) return 'warn';
    if (this.progressPercentage() >= 80) return 'primary';
    if (this.progressPercentage() >= 50) return 'accent';
    return 'primary';
  });

  /**
   * Maneja el clic en la tarjeta para seleccionar el plan
   */
  onCardClick(): void {
    this.planSelected.emit(this.plan);
  }

  /**
   * Maneja el cambio del checkbox de completado
   */
  onCompletedChange(completed: boolean): void {
    this.isCompleted.set(completed);
    this.planCompleted.emit({ plan: this.plan, completed });
  }

  /**
   * Obtiene el icono según el estado del plan
   */
  getStatusIcon(): string {
    switch (this.plan?.estado) {
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
}
