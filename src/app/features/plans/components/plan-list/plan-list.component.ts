import { Component, signal, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanCardComponent } from "../plan-card/plan-card.component";
import { Plan } from '../../models/plan-model';

@Component({
  selector: 'app-plan-list',
  imports: [
    CommonModule,
    MatExpansionModule,
    PlanCardComponent,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './plan-list.component.html',
  styleUrl: './plan-list.component.scss'
})
export class PlanListComponent {
  plans = input<Plan[]>([]);
  isLoading = input<boolean>(false);
  error = input<string | null>(null);

  planView = output<Plan>();
  planEdit = output<Plan>();
  planComplete = output<Plan>();
  refreshPlans = output<void>();

  readonly panelStates = signal<{ [key: number]: boolean }>({});

  hasPlans = computed(() => this.plans().length > 0);

  constructor(private snackBar: MatSnackBar) {}


  roundProgress(progress : number) : number {
    return Math.round(progress);
  }

  /**
   * Maneja la apertura/cierre de un panel
   */
  togglePanel(planId: number, isOpen: boolean): void {
    const currentStates = this.panelStates();
    this.panelStates.set({
      ...currentStates,
      [planId]: isOpen
    });
  }

  /**
   * Verifica si un panel está abierto
   */
  isPanelOpen(planId: number): boolean {
    return this.panelStates()[planId] || false;
  }

  /**
   * Maneja la visualización de un plan
   */
  onViewPlan(plan: Plan): void {
    this.planView.emit(plan);
    this.snackBar.open(`Abriendo plan "${plan.libro.titulo}"`, 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Maneja la edición de un plan
   */
  onEditPlan(plan: Plan): void {
    this.planEdit.emit(plan);
    this.snackBar.open(`Editando plan "${plan.libro.titulo}"`, 'Cerrar', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
  }

  /**
   * Maneja la finalización de un plan
   */
  onCompletePlan(plan: Plan): void {
    this.planComplete.emit(plan);
    this.snackBar.open(`Plan "${plan.libro.titulo}" marcado como completado`, 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Maneja la actualización de planes
   */
  onRefreshPlans(): void {
    this.refreshPlans.emit();
  }

  /**
   * Obtiene el progreso de un plan
   */
  getPlanProgress(plan: Plan): number {
    return Math.round(plan.progreso_porcentaje) || 0;
  }

  /**
   * Obtiene el icono según el estado del plan
   */
  getPlanIcon(plan: Plan): string {
    switch (plan.estado) {
      case 'ACTIVO':
        return 'auto_stories';
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
   * Obtiene el color del progreso según el estado
   */
  getProgressColor(plan: Plan): string {
    if (plan.dias_atrasado > 0) return 'warn';
    if (plan.progreso_porcentaje >= 80) return 'primary';
    if (plan.progreso_porcentaje >= 50) return 'accent';
    return 'primary';
  }
}
