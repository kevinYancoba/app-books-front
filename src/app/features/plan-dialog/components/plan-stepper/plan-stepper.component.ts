import { Component, inject, signal, computed, effect } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatTimepicker,
  MatTimepickerModule,
  MatTimepickerOption,
} from '@angular/material/timepicker';
import { AuthService } from '../../../../auth/services/auth.service';
import { PlanService } from '../../../plans/services/plan.service';
import { CreatePlanRequest } from '../../../plans/models/plan-model';
import { ImageCompressionUtil } from '../../../../core/utils/image-compression.util';

@Component({
  selector: 'app-plan-stepper',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTimepickerModule,
    MatIconModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './plan-stepper.component.html',
})
export class PlanStepperComponent {
  // Servicios inyectados
  private _formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  public planService = inject(PlanService);
  private snackBar = inject(MatSnackBar);

  // Signals para el estado del componente
  nivelLectura = signal([
    { value: 'novato', viewValue: 'Novato' },
    { value: 'intermedio', viewValue: 'Intermedio' },
    { value: 'profesional', viewValue: 'Profesional' },
    { value: 'experto', viewValue: 'Experto' },
  ]);

  selectedFile = signal<File | null>(null);
  compressedImageBase64 = signal<string>('');
  isCompressingImage = signal<boolean>(false);
  fileError = signal<string>('');
  isFormValid = computed(() => {
    return this.firstFormGroup.valid &&
           this.secondFormGroup.valid &&
           this.compressedImageBase64().length > 0;
  });

  customOptions: MatTimepickerOption<Date>[] = [
    { label: 'Mañana', value: new Date(2025, 0, 1, 9, 0, 0) },
    { label: 'Tarde', value: new Date(2025, 0, 1, 14, 0, 0) },
    { label: 'Noche', value: new Date(2025, 0, 1, 20, 0, 0) },
  ];

  // Formularios reactivos
  firstFormGroup = this._formBuilder.group({
    nivelLectura: ['', Validators.required],
    horarioLectura: ['', Validators.required],
    tiempoLecturaDiario: [30, [Validators.required, Validators.min(1), Validators.max(480)]],
    fechaFin: ['', Validators.required],
    finesSemana: [true]
  });

  secondFormGroup = this._formBuilder.group({
    tituloLibro: ['', [Validators.required, Validators.minLength(2)]],
    autorLibro: ['', [Validators.required, Validators.minLength(2)]]
  });

  isLinear = true;

  /**
   * Maneja la selección de archivo de imagen
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.clearFileSelection();
      return;
    }

    // Validar tipo de archivo
    if (!ImageCompressionUtil.validateFileType(file)) {
      this.fileError.set('Solo se permiten archivos de imagen (JPEG, PNG, WebP)');
      this.clearFileSelection();
      return;
    }

    // Validar tamaño de archivo (máximo 10MB)
    if (!ImageCompressionUtil.validateFileSize(file, 10)) {
      this.fileError.set('El archivo es demasiado grande. Máximo 10MB permitido');
      this.clearFileSelection();
      return;
    }

    this.selectedFile.set(file);
    this.fileError.set('');
    this.compressImage(file);
  }

  /**
   * Comprime la imagen seleccionada
   */
  private async compressImage(file: File): Promise<void> {
    try {
      this.isCompressingImage.set(true);

      const compressedBase64 = await ImageCompressionUtil.compressImageToBase64(
        file,
        800, // maxWidth
        600, // maxHeight
        0.8  // quality
      );

      this.compressedImageBase64.set(compressedBase64);
      this.isCompressingImage.set(false);

      console.log('Imagen comprimida exitosamente');
    } catch (error) {
      this.isCompressingImage.set(false);
      this.fileError.set('Error al procesar la imagen. Intenta con otra imagen.');
      console.error('Error al comprimir imagen:', error);
    }
  }

  /**
   * Limpia la selección de archivo
   */
  private clearFileSelection(): void {
    this.selectedFile.set(null);
    this.compressedImageBase64.set('');
    this.isCompressingImage.set(false);
  }

  /**
   * Abre el selector de archivos
   */
  openFileSelector(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Para abrir cámara en móviles
    input.onchange = (event) => this.onFileSelected(event);
    input.click();
  }

  /**
   * Envía el formulario al backend
   */
  submitForm(): void {
    if (!this.isFormValid()) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.snackBar.open('Error: Usuario no autenticado', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const firstFormData = this.firstFormGroup.value;
    const secondFormData = this.secondFormGroup.value;

    // Preparar los datos para el backend
    const planRequest: CreatePlanRequest = {
      idUsuario: parseInt(currentUser.id),
      nivelLectura: firstFormData.nivelLectura!,
      tiempoLecturaDiario: firstFormData.tiempoLecturaDiario!,
      horaioLectura: this.formatTimeForBackend(firstFormData.horarioLectura as any),
      fechaFin: this.formatDateForBackend(firstFormData.fechaFin as any),
      finesSemana: firstFormData.finesSemana!,
      tituloLibro: secondFormData.tituloLibro!,
      autorLibro: secondFormData.autorLibro!,
      indiceBase64: this.compressedImageBase64()
    };

    // Enviar al backend
    this.planService.createPlan(planRequest).subscribe({
      next: (response) => {
        this.snackBar.open('Plan de lectura creado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.resetForm();
        console.log('Plan creado:', response);
      },
      error: (error) => {
        this.snackBar.open('Error al crear el plan de lectura', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error al crear plan:', error);
      }
    });
  }

  /**
   * Formatea la hora para el backend (ISO string)
   */
  private formatTimeForBackend(time: any): string {
    const today = new Date();
    let timeDate: Date;

    if (time instanceof Date) {
      timeDate = time;
    } else if (typeof time === 'string') {
      timeDate = new Date(time);
    } else {
      timeDate = new Date();
    }

    // Crear una fecha con la hora seleccionada
    const combinedDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      timeDate.getHours(),
      timeDate.getMinutes(),
      0
    );

    return combinedDate.toISOString();
  }

  /**
   * Formatea la fecha para el backend (ISO string)
   */
  private formatDateForBackend(date: any): string {
    if (date instanceof Date) {
      return date.toISOString();
    } else if (typeof date === 'string') {
      return new Date(date).toISOString();
    } else {
      return new Date().toISOString();
    }
  }

  /**
   * Resetea el formulario
   */
  resetForm(): void {
    this.firstFormGroup.reset({
      nivelLectura: '',
      horarioLectura: '',
      tiempoLecturaDiario: 30,
      fechaFin: '',
      finesSemana: true
    });

    this.secondFormGroup.reset({
      tituloLibro: '',
      autorLibro: ''
    });

    this.clearFileSelection();
    this.fileError.set('');
  }

  /**
   * Obtiene el nombre del archivo seleccionado
   */
  getSelectedFileName(): string {
    const file = this.selectedFile();
    return file ? file.name : '';
  }

  /**
   * Verifica si hay un archivo seleccionado
   */
  hasSelectedFile(): boolean {
    return this.selectedFile() !== null;
  }
}
