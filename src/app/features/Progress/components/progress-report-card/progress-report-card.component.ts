import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ResumenLibros, EstadisticasProgreso, AnalisisCumplimiento } from '../../models/progress-report.model';

@Component({
  selector: 'app-progress-report-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule
  ],
  templateUrl: './progress-report-card.component.html',
  styleUrls: ['./progress-report-card.component.css']
})
export class ProgressReportCardComponent {
  @Input() resumenLibros: ResumenLibros | undefined;
  @Input() estadisticasProgreso: EstadisticasProgreso | undefined;
  @Input() analisisCumplimiento: AnalisisCumplimiento | undefined;

  getTendenciaIcon(): string {
    if (this.analisisCumplimiento?.tendencia === 'POSITIVA') {
      return 'trending_up';
    } else if (this.analisisCumplimiento?.tendencia === 'NEGATIVA') {
      return 'trending_down';
    }
    return 'trending_flat';
  }

  getTendenciaColor(): string {
    if (this.analisisCumplimiento?.tendencia === 'POSITIVA') {
      return 'text-green-600';
    } else if (this.analisisCumplimiento?.tendencia === 'NEGATIVA') {
      return 'text-red-600';
    }
    return 'text-gray-600';
  }
}

