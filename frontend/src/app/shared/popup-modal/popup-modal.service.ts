// popup.service.ts
import { Injectable, signal } from '@angular/core';
import { PopupType } from './popup-modal';

@Injectable({ providedIn: 'root' })
export class PopupService {

  message = signal('');
  type = signal<PopupType>('success');
  visible = signal(false);

  show(message: string, type: PopupType = 'success') {
    this.message.set(message);
    this.type.set(type);
    this.visible.set(true);
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  showWarning(message: string) {
    this.show(message, 'warning');
  }

  close() {
    this.visible.set(false);
  }
}