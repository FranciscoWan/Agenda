import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PopupService, PopupState } from './popup-modal.service';

@Component({
  selector: 'popup-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-modal.html'
})
export class PopupModalComponent {

  public popupService = inject(PopupService);

  onClose() {
    this.popupService.closeBottom();
  }

  // Computed para o título baseado no tipo do topo da pilha
  title = computed(() => {
    const top = this.popupService.topPopup;
    if (!top) return '';

    switch (top.type) {
      case 'error': return 'Erro';
      case 'warning': return 'Atenção';
      default: return 'Sucesso';
    }
  });

  // Computed para classes do botão do topo da pilha
  buttonClasses = computed(() => {
    const top = this.popupService.topPopup;
    if (!top) return {};

    return {
      'bg-red-600 hover:bg-red-500': top.type === 'error',
      'bg-yellow-600 hover:bg-yellow-500': top.type === 'warning',
      'bg-green-600 hover:bg-green-500': top.type === 'success',
    };
  });

  // Computed para classes da borda do popup do topo
  borderClasses = computed(() => {
    const top = this.popupService.topPopup;
    if (!top) return {};

    return {
      'border-red-500/30': top.type === 'error',
      'border-yellow-500/30': top.type === 'warning',
      'border-green-500/30': top.type === 'success',
    };
  });
}