import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanService } from '../../services/plan.service';
import { Plan, UpdatePlanRequest } from '../../models/plan-model';

@Component({
  selector: 'app-edit-plan',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-plan.component.html',
  styleUrl: './edit-plan.component.css'
})
export class EditPlanComponent implements OnInit {
  // Inyección de dependencias
  private readonly dialogRef = inject(MatDialogRef<EditPlanComponent>);
  private readonly data = inject<{ plan: Plan }>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly planService = inject(PlanService);
  private readonly snackBar = inject(MatSnackBar);

  // Signals
  isLoading = signal<boolean>(false);
  plan = signal<Plan>(this.data.plan);

  // Formulario reactivo
  editPlanForm!: FormGroup;

  // Fecha mínima (hoy)
  minDate = new Date();

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa el formulario con los datos del plan
   */
  private initializeForm(): void {
    const currentPlan = this.plan();

    this.editPlanForm = this.fb.group({
      titulo: [currentPlan.titulo, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: [currentPlan.descripcion || '', [Validators.maxLength(500)]],
      fechaFin: [new Date(currentPlan.fecha_fin), [Validators.required]],
      incluirFinesSemana: [currentPlan.incluir_fines_semana],
      paginasPorDia: [currentPlan.paginas_por_dia, [Validators.min(1), Validators.max(500)]],
      tiempoEstimadoDia: [currentPlan.tiempo_estimado_dia, [Validators.min(1), Validators.max(1440)]]
    });
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.editPlanForm.invalid) {
      this.editPlanForm.markAllAsTouched();
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading.set(true);

    const formValue = this.editPlanForm.value;
    const updateRequest: UpdatePlanRequest = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion || null,
      fechaFin: this.formatDateForBackend(formValue.fechaFin),
      incluirFinesSemana: formValue.incluirFinesSemana,
      paginasPorDia: formValue.paginasPorDia || null,
      tiempoEstimadoDia: formValue.tiempoEstimadoDia || null
    };

    this.planService.updatePlan(this.plan().id_plan, updateRequest).subscribe({
      next: (updatedPlan) => {
        this.isLoading.set(false);
        this.snackBar.open('Plan actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(updatedPlan);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error al actualizar el plan:', error);
        this.snackBar.open('Error al actualizar el plan', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Formatea la fecha para el backend
   */
  private formatDateForBackend(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T23:59:59Z`;
  }

  /**
   * Cierra el diálogo sin guardar
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.editPlanForm.get(fieldName);

    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      return 'Este campo es requerido';
    }
    if (field.errors['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['maxlength']) {
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    if (field.errors['min']) {
      return `El valor mínimo es ${field.errors['min'].min}`;
    }
    if (field.errors['max']) {
      return `El valor máximo es ${field.errors['max'].max}`;
    }

    return '';
  }
}
