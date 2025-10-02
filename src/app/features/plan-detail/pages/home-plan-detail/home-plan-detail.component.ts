import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlanCardDetailListComponent } from "../../components/plan-card-detail-list/plan-card-detail-list.component";
import { PlanDetail } from '../../../plans/models/plan-model';

@Component({
  selector: 'app-home-plan-detail',
  imports: [
    PlanCardDetailListComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home-plan-detail.component.html',
  styleUrl: './home-plan-detail.component.css'
})
export class HomePlanDetailComponent implements OnInit {
  // Servicios inyectados
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Signals
  planId = signal<number | null>(null);

  ngOnInit(): void {
    // Obtener el planId de los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('planId');
      if (id) {
        this.planId.set(parseInt(id));
      }
    });
  }

  /**
   * Maneja la selección de un detalle del plan
   */
  onPlanDetailSelected(planDetail: PlanDetail): void {
    console.log('Detalle seleccionado:', planDetail);
    this.snackBar.open(
      `Capítulo "${planDetail.capitulo.titulo_capitulo}" seleccionado`,
      'Cerrar',
      { duration: 2000 }
    );
  }

  /**
   * Maneja cuando un capítulo es marcado como leído
   */
  onChapterMarkedAsRead(event: {
    planDetail: PlanDetail;
    tiempoRealMinutos: number;
    dificultadPercibida: number;
    notas: string;
  }): void {
    console.log('Capítulo marcado como leído:', event);
    this.snackBar.open(
      `Capítulo "${event.planDetail.capitulo.titulo_capitulo}" marcado como leído`,
      'Cerrar',
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
  }

  /**
   * Navega de vuelta a la lista de planes
   */
  goBackToPlans(): void {
    this.router.navigate(['/home/plans']);
  }
}
