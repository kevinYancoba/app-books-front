import { Component, inject, signal, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanCardDetailComponent } from "../plan-card-detail/plan-card-detail.component";
import { PlanService } from '../../../plans/services/plan.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { PlanDetailed } from '../../../plans/models/plan-model';

@Component({
  selector: 'app-plan-card-detail-list',
  imports: [
    MatListModule,
    MatDividerModule,
    PlanCardDetailComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './plan-card-detail-list.component.html',
  styleUrl: './plan-card-detail-list.component.scss'
})
export class PlanCardDetailListComponent implements OnInit {
  // Servicios inyectados
  private planService = inject(PlanService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  // Signals para el estado del componente
  plans = signal<PlanDetailed[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUserPlans();
  }

  /**
   * Carga los planes del usuario actual
   */
  private loadUserPlans(): void {
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      this.error.set('Usuario no autenticado');
      this.snackBar.open('Error: Usuario no autenticado', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.planService.getUserPlans(parseInt(currentUser.id)).subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.isLoading.set(false);
        console.log('Planes cargados:', plans);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.error.set('Error al cargar los planes');
        this.snackBar.open('Error al cargar los planes de lectura', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error al cargar planes:', error);
      }
    });
  }

  /**
   * Maneja la selección de un plan
   */
  onPlanSelected(plan: PlanDetailed): void {
    console.log('Plan seleccionado:', plan);
    // Aquí puedes agregar navegación o abrir un modal con detalles
    this.snackBar.open(`Plan "${plan.libro.titulo}" seleccionado`, 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Maneja el cambio de estado de completado de un plan
   */
  onPlanCompleted(event: { plan: PlanDetailed, completed: boolean }): void {
    const { plan, completed } = event;
    console.log(`Plan ${plan.libro.titulo} marcado como ${completed ? 'completado' : 'no completado'}`);

    // Aquí puedes agregar lógica para actualizar el estado en el backend
    this.snackBar.open(
      `Plan "${plan.libro.titulo}" ${completed ? 'completado' : 'marcado como pendiente'}`,
      'Cerrar',
      {
        duration: 2000,
        panelClass: [completed ? 'success-snackbar' : 'info-snackbar']
      }
    );
  }

  /**
   * Recarga los planes
   */
  refreshPlans(): void {
    this.loadUserPlans();
  }

  /**
   * Verifica si hay planes para mostrar
   */
  hasPlans(): boolean {
    return this.plans().length > 0;
  }
}
