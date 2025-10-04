import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { PlanDetail } from '../../../plans/models/plan-model';

@Component({
  selector: 'app-plan-card-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
  ],
  templateUrl: './plan-card-detail.component.html',
  styleUrl: './plan-card-detail.component.scss',
})
export class PlanCardDetailComponent {
  @Input({ required: true }) planDetail!: PlanDetail;
  @Input() dayNumber: number = 1;
  @Output() planDetailSelected = new EventEmitter<PlanDetail>();
  @Output() markAsRead = new EventEmitter<{
    planDetail: PlanDetail;
    tiempoRealMinutos: number;
    dificultadPercibida: number;
    notas: string;
  }>();

  isCompleted = signal<boolean>(false);
  tiempoReal = signal<number>(0);
  dificultad = signal<number>(1);
  notas = signal<string>('');
  showReadForm = signal<boolean>(false);

  isOverdue = computed(() => {
    return this.planDetail?.es_atrasado || false;
  });

  statusColor = computed(() => {
    if (this.isOverdue()) return 'warn';
    if (this.planDetail?.leido) return 'primary';
    return 'accent';
  });

  pageRange = computed(() => {
    if (!this.planDetail) return '';
    return `${this.planDetail.pagina_inicio} - ${this.planDetail.pagina_fin}`;
  });


  roundProgress(progress: number): number {
    return Math.round(progress);
  }

  /**
   * Maneja el clic en la tarjeta para seleccionar el detalle del plan
   */
  onCardClick(): void {
    this.planDetailSelected.emit(this.planDetail);
  }

  /**
   * Maneja el cambio del checkbox de completado
   */
  onCompletedChange(completed: boolean): void {
    this.isCompleted.set(completed);
    if (completed) {
      this.showReadForm.set(true);
    } else {
      this.showReadForm.set(false);
      this.resetForm();
    }
  }

  /**
   * Confirma marcar como leído con los datos del formulario
   */
  onConfirmMarkAsRead(): void {
    if (this.tiempoReal() > 0) {
      this.markAsRead.emit({
        planDetail: this.planDetail,
        tiempoRealMinutos: this.tiempoReal(),
        dificultadPercibida: this.dificultad(),
        notas: this.notas(),
      });
      this.showReadForm.set(false);
      this.resetForm();
    }
  }

  /**
   * Cancela el formulario de marcar como leído
   */
  onCancelMarkAsRead(): void {
    this.isCompleted.set(false);
    this.showReadForm.set(false);
    this.resetForm();
  }

  /**
   * Resetea el formulario
   */
  private resetForm(): void {
    this.tiempoReal.set(this.planDetail?.tiempo_estimado_minutos || 0);
    this.dificultad.set(1);
    this.notas.set('');
  }

  /**
   * Obtiene el icono según el estado del detalle
   */
  getStatusIcon(): string {
    if (this.planDetail?.leido) {
      return 'check_circle';
    }
    if (this.isOverdue()) {
      return 'schedule';
    }
    return 'book';
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Obtiene el texto de dificultad
   */
  getDifficultyText(level: number): string {
    const levels = ['Muy fácil', 'Fácil', 'Normal', 'Difícil', 'Muy difícil'];
    return levels[level - 1] || 'Normal';
  }
}
