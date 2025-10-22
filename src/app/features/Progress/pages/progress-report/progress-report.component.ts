import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ProgressService } from '../../services/progress.service';
import { ProgressReportCardComponent } from '../../components/progress-report-card/progress-report-card.component';
import { ProgressReport } from '../../models/progress-report.model';

@Component({
  selector: 'app-progress-report',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    ProgressReportCardComponent
  ],
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.css']
})
export class ProgressReportComponent implements OnInit {
  private progressService = inject(ProgressService);
  private router = inject(Router);

  report = signal<ProgressReport | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadReport();
  }

  private loadReport(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.progressService.getProgressReport().subscribe({
      next: (data) => {
        this.report.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el reporte de progreso');
        this.isLoading.set(false);
        console.error('Error:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home/plans']);
  }
}

