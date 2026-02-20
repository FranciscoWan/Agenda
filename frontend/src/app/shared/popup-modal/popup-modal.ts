import { CommonModule } from '@angular/common';
import { Component, input, output, computed } from '@angular/core';

export type PopupType = 'success' | 'error' | 'warning';

@Component({
  selector: 'popup-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-modal.html'
})
export class PopupModalComponent {

  message = input<string>('');
  isVisible = input<boolean>(false);
  type = input<PopupType>('success');

  close = output<void>();

  onClose() {
    this.close.emit();
  }

  title = computed(() => {
    switch (this.type()) {
      case 'error': return 'Erro';
      case 'warning': return 'Atenção';
      default: return 'Sucesso';
    }
  });

  buttonClasses = computed(() => ({
    'bg-red-600 hover:bg-red-500': this.type() === 'error',
    'bg-yellow-600 hover:bg-yellow-500': this.type() === 'warning',
    'bg-green-600 hover:bg-green-500': this.type() === 'success',
  }));

  borderClasses = computed(() => ({
    'border-red-500/30': this.type() === 'error',
    'border-yellow-500/30': this.type() === 'warning',
    'border-green-500/30': this.type() === 'success',
  }));
}