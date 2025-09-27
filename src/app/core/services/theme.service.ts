import { DOCUMENT } from '@angular/common';
import { Injectable, signal, effect, inject, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private readonly THEME_KEY = 'trackbook_theme';

  // Signal para el tema actual
  private _currentTheme = signal<Theme>(this.getInitialTheme());

  // Computed signal público de solo lectura
  public readonly currentTheme = this._currentTheme.asReadonly();
  public readonly isDarkMode = computed(() => this.currentTheme() === 'dark');

  constructor() {
    // Effect para aplicar el tema cuando cambie
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this._currentTheme.set(newTheme);
    localStorage.setItem(this.THEME_KEY, newTheme);
  }

  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    const htmlElement = this.document.documentElement;
    htmlElement.setAttribute('data-theme', theme);
    htmlElement.style.colorScheme = theme;
  }
}
