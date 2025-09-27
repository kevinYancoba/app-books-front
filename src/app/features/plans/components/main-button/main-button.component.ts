import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PlanDialogComponent } from '../../../plan-dialog/components/plan-dialog/plan-dialog.component';

@Component({
  selector: 'app-main-button',
  imports: [MatIconModule, MatButtonModule],
  template: `
     <div class="fixed bottom-4 right-4 z-50 mb-20">
      <button mat-fab type="button" (click)="openDialog()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
})
export class MainButtonComponent {

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(PlanDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
