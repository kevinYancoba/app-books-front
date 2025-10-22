import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { PlanStatistics } from '../../../plans/models/plan-model';

@Component({
  selector: 'app-plan-statistics-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './plan-statistics-card.component.html',
  styleUrls: ['./plan-statistics-card.component.css']
})
export class PlanStatisticsCardComponent {
  @Input() statistics: PlanStatistics | undefined;

  getChaptersPercentage(): number {
    if (!this.statistics) return 0;
    return this.statistics.totalCapitulos > 0
      ? Math.round((this.statistics.capitulosCompletados / this.statistics.totalCapitulos) * 100)
      : 0;
  }

  getPagesPercentage(): number {
    if (!this.statistics) return 0;
    return this.statistics.totalPaginas > 0
      ? Math.round((this.statistics.paginasLeidas / this.statistics.totalPaginas) * 100)
      : 0;
  }

  getDaysPercentage(): number {
    if (!this.statistics) return 0;
    return this.statistics.diasTotales > 0
      ? Math.round((this.statistics.diasCompletados / this.statistics.diasTotales) * 100)
      : 0;
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 80) return 'primary';
    if (percentage >= 50) return 'accent';
    return 'warn';
  }
}

