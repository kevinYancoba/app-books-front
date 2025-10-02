import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanListComponent } from "../../components/plan-list/plan-list.component";
import { MainButtonComponent } from "../../components/main-button/main-button.component";
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { Plan } from '../../models/plan-model';

@Component({
  selector: 'app-home-plans',
  imports: [
    CommonModule,
    PlanListComponent,
    MainButtonComponent
  ],
  templateUrl: './home-plans.component.html',
  styleUrl: './home-plans.component.css'
})
export class HomePlansComponent implements OnInit {
  // Servicios inyectados
  private readonly planService = inject(PlanService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  // Signals para el estado
  plans = signal<Plan[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUserPlans();
  }

  /**
   * Carga los planes del usuario autenticado
   */
  private loadUserPlans(): void {
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      this.error.set('Usuario no autenticado');
      this.snackBar.open('Debes iniciar sesión para ver tus planes', 'Cerrar', {
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
        this.error.set('Error al cargar los planes de lectura');
        console.error('Error al cargar planes:', error);
        this.snackBar.open('Error al cargar los planes', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Maneja la visualización de un plan
   */
  onPlanView(plan: Plan): void {
    console.log('Ver plan:', plan);
    // TODO: Navegar a la vista detallada del plan
    this.snackBar.open(`Abriendo plan "${plan.libro.titulo}"`, 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Maneja la edición de un plan
   */
  onPlanEdit(plan: Plan): void {
    console.log('Editar plan:', plan);
    // TODO: Abrir modal de edición o navegar a página de edición
    this.snackBar.open(`Editando plan "${plan.libro.titulo}"`, 'Cerrar', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
  }

  /**
   * Maneja la finalización de un plan
   */
  onPlanComplete(plan: Plan): void {
    console.log('Completar plan:', plan);
    // TODO: Llamar al servicio para marcar como completado
    this.snackBar.open(`Plan "${plan.libro.titulo}" marcado como completado`, 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Maneja la actualización de la lista de planes
   */
  onRefreshPlans(): void {
    this.loadUserPlans();
  }
}
