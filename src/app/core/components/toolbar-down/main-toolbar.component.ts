import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-toolbar',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
  ],
  templateUrl: './main-toolbar.component.html',
  styles: ``,
})
export class MainToolbarComponent {
  navItems = signal([
    { icon: 'auto_stories', label: 'planes', route: '/plan' },
    { icon: 'analytics', label: 'Informes', route: '/informe' },
  ]);

  activeIndex = signal(0);

  setActive(index: number) {
    this.activeIndex.update((i) => index);
  }
}
