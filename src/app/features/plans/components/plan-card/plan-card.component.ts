// src/app/planes/components/plan-card/plan-card.component.ts
import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { Plan } from '../../models/plan-model';
import {MatChipsModule} from '@angular/material/chips';

const MOCK_PLANS: Plan[] = [
  {
    id: 1,
    titulo: 'Lectura de Génesis',
    descripcion: 'Plan de lectura del primer libro de la Biblia en 30 días.',
    progreso: 25,
    portadaUrl: 'https://goo.su/s9voI',
  },
  {
    id: 2,
    titulo: 'Evangelios en 40 días',
    descripcion: 'Lee Mateo, Marcos, Lucas y Juan en un tiempo de 40 días.',
    progreso: 50,
    portadaUrl: 'https://goo.su/s9voI',
  },
  {
    id: 3,
    titulo: 'Cartas de Pablo',
    descripcion: 'Plan para estudiar las cartas paulinas durante 2 meses.',
    progreso: 10,
    portadaUrl: 'https://goo.su/s9voI',
  },
  {
    id: 4,
    titulo: 'Salmos de alabanza',
    descripcion: 'Lectura seleccionada de salmos de adoración y gratitud.',
    progreso: 70,
    portadaUrl: 'https://goo.su/s9voI',
  },
  {
    id: 5,
    titulo: 'Profetas Mayores',
    descripcion: 'Plan de lectura de Isaías, Jeremías, Lamentaciones, Ezequiel y Daniel.',
    progreso: 0,
    portadaUrl: 'https://goo.su/s9voI',
  },
];

@Component({
  selector: 'app-plan-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './plan-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanCardComponent {
  /** Entrada: un solo plan */
  plan = input<Plan | null>(null);

  /** Entrada: varios planes (cuando la API devuelve lista) */
  plans = input<Plan[]>(MOCK_PLANS);

  /** Forzar vista compacta (lista) */
  compact = input<boolean>(false);

  /** Salidas: eventos */
  viewPlan = output<Plan>();
  editPlan = output<Plan>();

  onView(p: Plan) {
    this.viewPlan.emit(p);
  }

  onEdit(p: Plan) {
    this.editPlan.emit(p);
  }

  getDisplayProgress(p: Plan): number {
    const v = Math.round(p.progreso ?? 0);
    if (v < 0) return 0;
    if (v > 100) return 100;
    return v;
  }
}
