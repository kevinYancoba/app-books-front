import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PlanDialogComponent } from '../../../plan-dialog/components/plan-dialog/plan-dialog.component';

@Component({
  selector: 'app-main-button',
  imports: [MatIconModule, MatButtonModule],
  template: `
  <div class="fixed bottom-4 right-4 z-50 flex flex-row gap-3 items-center">
    <button mat-fab extended type="button" (click)="openDialog()">
      <mat-icon>add</mat-icon>
      Nuevo plan
    </button>
    <button mat-fab type="button" (click)="goToReport()">
      <mat-icon>assessment</mat-icon>
    </button>
  </div>
`,
})
export class MainButtonComponent {

  readonly dialog = inject(MatDialog);
  private router = inject(Router);

  // Output para notificar cuando se crea un plan
  planCreated = output<any>();

  goToReport() {
    this.router.navigate(['/home/progress/report']);
  }

  openDialog() {
    const dialogRef = this.dialog.open(PlanDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result:`, result);
      if (result) {
        // Si se creó un plan, emitir el evento
        this.planCreated.emit(result);
      }
    });
  }
}
