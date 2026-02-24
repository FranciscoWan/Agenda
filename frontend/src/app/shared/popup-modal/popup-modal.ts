import { CommonModule } from '@angular/common';
import { Component, input, output, computed, inject } from '@angular/core';
import { PopupService } from './popup-modal.service';

export type PopupType = 'success' | 'error' | 'warning';

@Component({
  selector: 'popup-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-modal.html'
})
export class PopupModalComponent {

  public popupService = inject(PopupService);

  onClose() {
    this.popupService.close();
  }

  title = computed(() => {
    switch (this.popupService.type()) {
      case 'error': return 'Erro';
      case 'warning': return 'Atenção';
      default: return 'Sucesso';
    }
  });

  buttonClasses = computed(() => ({
    'bg-red-600 hover:bg-red-500': this.popupService.type() === 'error',
    'bg-yellow-600 hover:bg-yellow-500': this.popupService.type() === 'warning',
    'bg-green-600 hover:bg-green-500': this.popupService.type() === 'success',
  }));

  borderClasses = computed(() => ({
    'border-red-500/30': this.popupService.type() === 'error',
    'border-yellow-500/30': this.popupService.type() === 'warning',
    'border-green-500/30': this.popupService.type() === 'success',
  }));
}