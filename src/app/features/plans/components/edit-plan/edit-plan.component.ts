import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTimepickerModule } from '@angular/material/timepicker';
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
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTimepickerModule
  ],
  templateUrl: './edit-plan.component.html',
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

  // Opciones para nivel de lectura
  readonly nivelesLectura = ['novato', 'intermedio', 'profesional', 'experto'];

  // Perfiles de lectura con tiempos recomendados
  private readonly readingProfiles = {
    novato: {
      min: 15,
      optimal: 20,
      max: 30,
      minPerPage: 3,
      maxPerPage: 6
    },
    intermedio: {
      min: 20,
      optimal: 30,
      max: 45,
      minPerPage: 2,
      maxPerPage: 4.5
    },
    profesional: {
      min: 25,
      optimal: 35,
      max: 60,
      minPerPage: 1.5,
      maxPerPage: 4
    },
    experto: {
      min: 20,
      optimal: 30,
      max: 45,
      minPerPage: 1,
      maxPerPage: 2.25
    }
  };

  // Formulario reactivo
  editPlanForm!: FormGroup;

  // Valores iniciales para detectar cambios
  private initialValues: any;

  ngOnInit(): void {
    this.initializeForm();
    this.setupChangeDetection();
  }

  /**
   * Inicializa el formulario con los datos del plan
   */
  private initializeForm(): void {
    const currentPlan = this.plan();

    this.editPlanForm = this.fb.group({
      titulo: [currentPlan.titulo, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: [currentPlan.descripcion || '', [Validators.required, Validators.maxLength(500)]],
      incluirFinesSemana: [currentPlan.incluir_fines_semana, [Validators.required]],
      nivelLectura: ['intermedio', [Validators.required]],
      tiempoEstimadoDia: [currentPlan.tiempo_estimado_dia, [Validators.required, Validators.min(1), Validators.max(1440)]],
      horaPreferida: ['20:00:00', [Validators.required]],
      regenerarDetalles: [false]
    });

    // Guardar valores iniciales
    this.initialValues = {
      nivelLectura: this.editPlanForm.get('nivelLectura')?.value,
      tiempoEstimadoDia: this.editPlanForm.get('tiempoEstimadoDia')?.value,
      incluirFinesSemana: this.editPlanForm.get('incluirFinesSemana')?.value
    };
  }

  /**
   * Configura la detección de cambios para regenerarDetalles y tiempo estimado
   */
  private setupChangeDetection(): void {
    const nivelLecturaControl = this.editPlanForm.get('nivelLectura');
    const tiempoEstimadoDiaControl = this.editPlanForm.get('tiempoEstimadoDia');
    const incluirFinesSemanaControl = this.editPlanForm.get('incluirFinesSemana');
    const regenerarDetallesControl = this.editPlanForm.get('regenerarDetalles');

    // Escuchar cambios en nivel de lectura para actualizar tiempo estimado
    nivelLecturaControl?.valueChanges.subscribe((nivel) => {
      this.updateTiempoEstimadoByNivel(nivel, tiempoEstimadoDiaControl);
      this.updateRegenerarDetalles(regenerarDetallesControl);
    });

    tiempoEstimadoDiaControl?.valueChanges.subscribe(() => {
      this.updateRegenerarDetalles(regenerarDetallesControl);
    });

    incluirFinesSemanaControl?.valueChanges.subscribe(() => {
      this.updateRegenerarDetalles(regenerarDetallesControl);
    });
  }

  /**
   * Actualiza el tiempo estimado basado en el nivel de lectura seleccionado
   */
  private updateTiempoEstimadoByNivel(nivel: string, tiempoControl: any): void {
    const profile = this.readingProfiles[nivel as keyof typeof this.readingProfiles];
    if (profile) {
      tiempoControl?.setValue(profile.optimal, { emitEvent: false });
    }
  }

  /**
   * Actualiza el valor de regenerarDetalles basado en cambios detectados
   */
  private updateRegenerarDetalles(regenerarDetallesControl: any): void {
    const nivelLecturaChanged = this.editPlanForm.get('nivelLectura')?.value !== this.initialValues.nivelLectura;
    const tiempoEstimadoDiaChanged = this.editPlanForm.get('tiempoEstimadoDia')?.value !== this.initialValues.tiempoEstimadoDia;
    const incluirFinesSemanaChanged = this.editPlanForm.get('incluirFinesSemana')?.value !== this.initialValues.incluirFinesSemana;

    const shouldRegenerate = nivelLecturaChanged || tiempoEstimadoDiaChanged || incluirFinesSemanaChanged;
    regenerarDetallesControl?.setValue(shouldRegenerate, { emitEvent: false });
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

    // Construir el request con la nueva estructura
    const updateRequest: UpdatePlanRequest = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      incluirFinesSemana: formValue.incluirFinesSemana,
      nivelLectura: formValue.nivelLectura,
      tiempoEstimadoDia: formValue.tiempoEstimadoDia,
      horaPreferida: formValue.horaPreferida,
      regenerarDetalles: formValue.regenerarDetalles
    };

    console.log('Enviando actualización de plan:', updateRequest);

    this.planService.updatePlan(this.plan().id_plan, updateRequest).subscribe({
      next: (updatedPlan) => {
        this.isLoading.set(false);
        console.log('Plan actualizado:', updatedPlan);
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
