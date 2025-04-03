import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly defaultTheme: ThemeColors = {
    primary: '#3B82F6',
    secondary: '#6B7280',
    background: '#F9FAFB',
    text: '#1F2937',
    border: '#E5E7EB'
  };

  private themeSubject = new BehaviorSubject<ThemeColors>(this.defaultTheme);
  theme$ = this.themeSubject.asObservable();

  constructor() {
    // Apply initial theme
    this.applyTheme(this.defaultTheme);
  }

  updateTheme(newTheme: Partial<ThemeColors>) {
    const currentTheme = this.themeSubject.value;
    const updatedTheme = { ...currentTheme, ...newTheme };
    this.themeSubject.next(updatedTheme);
    this.applyTheme(updatedTheme);
  }

  private applyTheme(theme: ThemeColors) {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }
} 