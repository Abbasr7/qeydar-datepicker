import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, Optional } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DatePickerTheme {
  name: string;
  displayName: string;
  variables: Record<string, string>;
  isDark?: boolean;
}

export interface DatePickerThemeConfig {
  defaultTheme: string;
  themes: DatePickerTheme[];
  enableSystemTheme?: boolean;
  enableThemeSwitching?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatePickerThemeService {
  private readonly THEME_STORAGE_KEY = 'qeydar-datepicker-theme';
  private readonly THEME_ATTRIBUTE = 'data-qeydar-theme';
  private readonly THEME_CLASS_PREFIX = 'qeydar-theme-';
  
  private currentThemeSubject = new BehaviorSubject<string>('');
  public currentTheme$ = this.currentThemeSubject.asObservable();
  
  private config: DatePickerThemeConfig;
  private document: Document;

  constructor(
    @Inject(DOCUMENT) document: Document,
    @Optional() @Inject('DATE_PICKER_THEME_CONFIG') themeConfig?: DatePickerThemeConfig
  ) {
    this.document = document;
    this.initializeConfig(themeConfig);
    this.initializeTheme();
  }

  /**
   * Initialize theme configuration with defaults
   */
  private initializeConfig(config?: DatePickerThemeConfig): void {
    this.config = config || this.getDefaultConfig();
  }

  /**
   * Get default theme configuration
   */
  private getDefaultConfig(): DatePickerThemeConfig {
    return {
      defaultTheme: 'light',
      enableSystemTheme: true,
      enableThemeSwitching: true,
      themes: [
        {
          name: 'light',
          displayName: 'Light',
          isDark: false,
          variables: {
            '--qeydar-primary-color': '#1890ff',
            '--qeydar-primary-hover': '#40a9ff',
            '--qeydar-primary-active': '#096dd9',
            '--qeydar-success-color': '#52c41a',
            '--qeydar-warning-color': '#faad14',
            '--qeydar-error-color': '#ff4d4f',
            '--qeydar-text-color': '#000000d9',
            '--qeydar-text-color-secondary': '#00000073',
            '--qeydar-text-color-disabled': '#00000040',
            '--qeydar-border-color': '#d9d9d9',
            '--qeydar-border-color-hover': '#40a9ff',
            '--qeydar-background-color': '#ffffff',
            '--qeydar-background-color-light': '#fafafa',
            '--qeydar-background-color-hover': '#f5f5f5',
            '--qeydar-background-color-active': '#e6f7ff',
            '--qeydar-shadow': '0 2px 8px rgba(0, 0, 0, 0.15)',
            '--qeydar-shadow-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
            '--qeydar-border-radius': '6px',
            '--qeydar-border-radius-small': '4px',
            '--qeydar-font-size': '14px',
            '--qeydar-font-size-small': '12px',
            '--qeydar-font-size-large': '16px',
            '--qeydar-line-height': '1.5715',
            '--qeydar-padding': '8px 12px',
            '--qeydar-padding-small': '4px 8px',
            '--qeydar-padding-large': '12px 16px',
            '--qeydar-margin': '8px',
            '--qeydar-margin-small': '4px',
            '--qeydar-margin-large': '16px',
            '--qeydar-transition': 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
            '--qeydar-transition-fast': 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
            '--qeydar-z-index': '1050',
            '--qeydar-z-index-dropdown': '1050',
            '--qeydar-z-index-modal': '1000'
          }
        },
        {
          name: 'dark',
          displayName: 'Dark',
          isDark: true,
          variables: {
            '--qeydar-primary-color': '#177ddc',
            '--qeydar-primary-hover': '#3c9be8',
            '--qeydar-primary-active': '#0958d9',
            '--qeydar-success-color': '#49aa19',
            '--qeydar-warning-color': '#d89614',
            '--qeydar-error-color': '#dc4446',
            '--qeydar-text-color': '#ffffffd9',
            '--qeydar-text-color-secondary': '#ffffff73',
            '--qeydar-text-color-disabled': '#ffffff40',
            '--qeydar-border-color': '#424242',
            '--qeydar-border-color-hover': '#3c9be8',
            '--qeydar-background-color': '#141414',
            '--qeydar-background-color-light': '#1f1f1f',
            '--qeydar-background-color-hover': '#262626',
            '--qeydar-background-color-active': '#111b26',
            '--qeydar-shadow': '0 2px 8px rgba(0, 0, 0, 0.45)',
            '--qeydar-shadow-hover': '0 4px 12px rgba(0, 0, 0, 0.45)',
            '--qeydar-border-radius': '6px',
            '--qeydar-border-radius-small': '4px',
            '--qeydar-font-size': '14px',
            '--qeydar-font-size-small': '12px',
            '--qeydar-font-size-large': '16px',
            '--qeydar-line-height': '1.5715',
            '--qeydar-padding': '8px 12px',
            '--qeydar-padding-small': '4px 8px',
            '--qeydar-padding-large': '12px 16px',
            '--qeydar-margin': '8px',
            '--qeydar-margin-small': '4px',
            '--qeydar-margin-large': '16px',
            '--qeydar-transition': 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
            '--qeydar-transition-fast': 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
            '--qeydar-z-index': '1050',
            '--qeydar-z-index-dropdown': '1050',
            '--qeydar-z-index-modal': '1000'
          }
        },
        {
          name: 'blue',
          displayName: 'Blue',
          isDark: false,
          variables: {
            '--qeydar-primary-color': '#1890ff',
            '--qeydar-primary-hover': '#40a9ff',
            '--qeydar-primary-active': '#096dd9',
            '--qeydar-success-color': '#52c41a',
            '--qeydar-warning-color': '#faad14',
            '--qeydar-error-color': '#ff4d4f',
            '--qeydar-text-color': '#ffffff',
            '--qeydar-text-color-secondary': '#ffffffb3',
            '--qeydar-text-color-disabled': '#ffffff66',
            '--qeydar-border-color': '#40a9ff',
            '--qeydar-border-color-hover': '#69c0ff',
            '--qeydar-background-color': '#001529',
            '--qeydar-background-color-light': '#002140',
            '--qeydar-background-color-hover': '#003a75',
            '--qeydar-background-color-active': '#00449a',
            '--qeydar-shadow': '0 2px 8px rgba(0, 0, 0, 0.15)',
            '--qeydar-shadow-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
            '--qeydar-border-radius': '6px',
            '--qeydar-border-radius-small': '4px',
            '--qeydar-font-size': '14px',
            '--qeydar-font-size-small': '12px',
            '--qeydar-font-size-large': '16px',
            '--qeydar-line-height': '1.5715',
            '--qeydar-padding': '8px 12px',
            '--qeydar-padding-small': '4px 8px',
            '--qeydar-padding-large': '12px 16px',
            '--qeydar-margin': '8px',
            '--qeydar-margin-small': '4px',
            '--qeydar-margin-large': '16px',
            '--qeydar-transition': 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
            '--qeydar-transition-fast': 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
            '--qeydar-z-index': '1050',
            '--qeydar-z-index-dropdown': '1050',
            '--qeydar-z-index-modal': '1000'
          }
        }
      ]
    };
  }

  /**
   * Initialize theme system
   */
  private initializeTheme(): void {
    const savedTheme = this.getStoredTheme();
    const systemTheme = this.config.enableSystemTheme ? this.getSystemTheme() : null;
    const initialTheme = savedTheme || systemTheme || this.config.defaultTheme;
    
    this.setTheme(initialTheme);
    this.setupSystemThemeListener();
  }

  /**
   * Setup system theme change listener
   */
  private setupSystemThemeListener(): void {
    if (!this.config.enableSystemTheme) return;

    const mediaQuery = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery) {
      mediaQuery.addEventListener('change', (e) => {
        const currentTheme = this.getCurrentTheme();
        if (!this.getStoredTheme()) {
          const systemTheme = this.getSystemTheme();
          if (systemTheme !== currentTheme) {
            this.setTheme(systemTheme);
          }
        }
      });
    }
  }

  /**
   * Get system theme preference
   */
  private getSystemTheme(): string {
    if (this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Get stored theme from localStorage
   */
  private getStoredTheme(): string | null {
    try {
      return localStorage.getItem(this.THEME_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Store theme in localStorage
   */
  private storeTheme(theme: string): void {
    try {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Get current theme name
   */
  getCurrentTheme(): string {
    return this.currentThemeSubject.value;
  }

  /**
   * Get current theme object
   */
  getCurrentThemeObject(): DatePickerTheme | null {
    const themeName = this.getCurrentTheme();
    return this.getTheme(themeName);
  }

  /**
   * Get theme by name
   */
  getTheme(name: string): DatePickerTheme | null {
    return this.config.themes.find(theme => theme.name === name) || null;
  }

  /**
   * Get all available themes
   */
  getThemes(): DatePickerTheme[] {
    return [...this.config.themes];
  }

  /**
   * Set theme by name
   */
  setTheme(themeName: string): boolean {
    const theme = this.getTheme(themeName);
    if (!theme) {
      console.warn(`Theme '${themeName}' not found`);
      return false;
    }

    this.applyTheme(theme);
    this.currentThemeSubject.next(themeName);
    this.storeTheme(themeName);
    return true;
  }

  /**
   * Apply theme variables to document
   */
  private applyTheme(theme: DatePickerTheme): void {
    const root = this.document.documentElement;
    
    // Remove previous theme classes
    this.config.themes.forEach(t => {
      root.classList.remove(`${this.THEME_CLASS_PREFIX}${t.name}`);
    });
    
    // Add current theme class
    root.classList.add(`${this.THEME_CLASS_PREFIX}${theme.name}`);
    
    // Set theme attribute
    root.setAttribute(this.THEME_ATTRIBUTE, theme.name);
    
    // Apply CSS variables
    Object.entries(theme.variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): string {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }

  /**
   * Check if current theme is dark
   */
  isDarkTheme(): boolean {
    const currentTheme = this.getCurrentThemeObject();
    return currentTheme?.isDark || false;
  }

  /**
   * Get theme configuration
   */
  getConfig(): DatePickerThemeConfig {
    return { ...this.config };
  }

  /**
   * Update theme configuration
   */
  updateConfig(config: Partial<DatePickerThemeConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Add custom theme
   */
  addTheme(theme: DatePickerTheme): boolean {
    if (this.getTheme(theme.name)) {
      console.warn(`Theme '${theme.name}' already exists`);
      return false;
    }
    
    this.config.themes.push(theme);
    return true;
  }

  /**
   * Remove theme
   */
  removeTheme(themeName: string): boolean {
    const index = this.config.themes.findIndex(theme => theme.name === themeName);
    if (index === -1) {
      console.warn(`Theme '${themeName}' not found`);
      return false;
    }
    
    // Don't allow removing the current theme
    if (this.getCurrentTheme() === themeName) {
      console.warn(`Cannot remove current theme '${themeName}'`);
      return false;
    }
    
    this.config.themes.splice(index, 1);
    return true;
  }

  /**
   * Update existing theme
   */
  updateTheme(themeName: string, updates: Partial<DatePickerTheme>): boolean {
    const theme = this.getTheme(themeName);
    if (!theme) {
      console.warn(`Theme '${themeName}' not found`);
      return false;
    }
    
    Object.assign(theme, updates);
    
    // If updating current theme, reapply it
    if (this.getCurrentTheme() === themeName) {
      this.applyTheme(theme);
    }
    
    return true;
  }

  /**
   * Get CSS variable value
   */
  getCSSVariable(variableName: string): string | null {
    const root = this.document.documentElement;
    return root.style.getPropertyValue(variableName) || 
           this.document.defaultView?.getComputedStyle(root).getPropertyValue(variableName) || 
           null;
  }

  /**
   * Set CSS variable value
   */
  setCSSVariable(variableName: string, value: string): void {
    const root = this.document.documentElement;
    root.style.setProperty(variableName, value);
  }

  /**
   * Reset to default theme
   */
  resetToDefault(): void {
    this.setTheme(this.config.defaultTheme);
  }

  /**
   * Clear stored theme preference
   */
  clearStoredTheme(): void {
    try {
      localStorage.removeItem(this.THEME_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
}
