import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PlanListComponent } from "../../components/plan-list/plan-list.component";
import { MainButtonComponent } from "../../components/main-button/main-button.component";
import { EditPlanComponent } from "../../components/edit-plan/edit-plan.component";
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
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

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
    // Navegar a la vista detallada del plan
    this.router.navigate(['/home/plan-detail', plan.id_plan]);
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

    const dialogRef = this.dialog.open(EditPlanComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: { plan },
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // El plan fue actualizado, recargar la lista
        this.snackBar.open(`Plan "${result.titulo}" actualizado exitosamente`, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadUserPlans();
      }
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
   * Maneja la eliminación de un plan
   */
  onPlanDelete(plan: Plan): void {
    console.log('Eliminar plan:', plan);

    // Mostrar diálogo de confirmación usando MatSnackBar con acción
    const snackBarRef = this.snackBar.open(
      `¿Estás seguro de eliminar el plan "${plan.titulo}"?`,
      'Eliminar',
      {
        duration: 5000,
        panelClass: ['warn-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.deletePlan(plan);
    });
  }

  /**
   * Elimina un plan
   */
  private deletePlan(plan: Plan): void {
    this.isLoading.set(true);

    this.planService.deletePlan(plan.id_plan).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open(
          `Plan "${plan.titulo}" eliminado exitosamente`,
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['success-snackbar']
          }
        );
        // Recargar la lista de planes
        this.loadUserPlans();
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error al eliminar plan:', error);
        this.snackBar.open(
          'Error al eliminar el plan. Por favor, intenta de nuevo.',
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  /**
   * Maneja la creación de un nuevo plan
   */
  onPlanCreated(plan: any): void {
    console.log('Plan creado:', plan);
    this.snackBar.open(
      'Plan de lectura creado exitosamente',
      'Cerrar',
      {
        duration: 3000,
        panelClass: ['success-snackbar']
      }
    );
    // Recargar la lista de planes
    this.loadUserPlans();
  }

  /**
   * Maneja la actualización de la lista de planes
   */
  onRefreshPlans(): void {
    this.loadUserPlans();
  }
}
