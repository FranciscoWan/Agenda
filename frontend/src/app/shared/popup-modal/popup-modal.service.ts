// popup.service.ts
import { Injectable, signal } from '@angular/core';
import { PopupType } from './popup-modal';

@Injectable({ providedIn: 'root' })
export class PopupService {

  message = signal('');
  type = signal<PopupType>('success');
  visible = signal(false);

  showError(message: string) {
    this.message.set(message);
    this.type.set('error');
    this.visible.set(true);
  }

  showSuccess(message: string) {
    this.message.set(message);
    this.type.set('success');
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
  }
}