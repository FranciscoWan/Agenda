import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalLoaderService {

  private _loading = signal(false);
  public readonly loading = this._loading.asReadonly();

  private activeRequests = 0;

  private showDelayTimer: any;
  private failSafeTimer: any;

  start() {
    this.activeRequests++;

    // Só agenda o loader se for a primeira request
    if (this.activeRequests === 1) {

      // Delay mínimo de 400ms antes de mostrar
      this.showDelayTimer = setTimeout(() => {
        if (this.activeRequests > 0) {
          this._loading.set(true);
        }
      }, 400);

      // Fail-safe de 5 segundos
      this.failSafeTimer = setTimeout(() => {
        this.stopAll();
      }, 5000);
    }
  }

  stop() {
    this.activeRequests--;

    if (this.activeRequests <= 0) {
      this.stopAll();
    }
  }

  private stopAll() {
    this.activeRequests = 0;

    clearTimeout(this.showDelayTimer);
    clearTimeout(this.failSafeTimer);

    this._loading.set(false);
  }
}