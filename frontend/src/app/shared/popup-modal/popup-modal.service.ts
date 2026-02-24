import { Injectable, signal } from '@angular/core';

export type PopupType = 'success' | 'error' | 'warning';

export interface PopupState {
  message: string;
  type: PopupType;
  isConfirm: boolean;
  resolver?: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class PopupService {

  // fila de popups
  popups = signal<PopupState[]>([]);

  // Retorna o topo da pilha
  get topPopup(): PopupState | undefined {
    const all = this.popups();
    return all[all.length - 1];
  }

  // Retorna o popup do fundo (bottomPopup)
  get bottomPopup(): PopupState | undefined {
    const all = this.popups();
    return all[0];
  }

  // --- FUNÇÕES ANTIGAS MANTIDAS ---
  show(message: string, type: PopupType = 'success') {
    this.popups.update(arr => [...arr, { message, type, isConfirm: false }]);
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  confirm(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.popups.update(arr => [...arr, { message, type: 'warning', isConfirm: true, resolver: resolve }]);
    });
  }

  // --- AÇÕES ---
  confirmAction() {
    const bottom = this.bottomPopup;
    if (bottom?.resolver) bottom.resolver(true);
    this.closeBottom();
  }

  cancelAction() {
    console.log("trigou")
    const bottom = this.bottomPopup;
    if (bottom?.resolver) bottom.resolver(false);
    this.closeBottom();
  }

  closeBottom() {
    // Corige o flik bug
    setTimeout(() => {
      this.popups.update(arr => arr.slice(1));
    }, 150);
  }
}