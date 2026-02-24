import { Injectable, signal } from '@angular/core';
import { PopupType } from './popup-modal';

@Injectable({ providedIn: 'root' })
export class PopupService {

  message = signal('');
  type = signal<PopupType>('success');
  visible = signal(false);

  confirmCallback = signal<(() => void) | null>(null);

  show(message: string, type: PopupType = 'success') {
    this.message.set(message);
    this.type.set(type);
    this.confirmCallback.set(null);
    this.visible.set(true);
  }

  showConfirm(message: string, onConfirm: () => void) {
    this.message.set(message);
    this.type.set('warning');
    this.confirmCallback.set(onConfirm);
    this.visible.set(true);
  }

  confirm() {
    const callback = this.confirmCallback();
    if (callback) callback();
    this.close();
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  close() {
    this.visible.set(false);
    this.confirmCallback.set(null);
  }
}