import { Component, computed, input, output, InputSignal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fa-icon-button',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  template: `
    <button
      (click)="handleClick()"
      [ngClass]="buttonClasses()"
    >
      <fa-icon
        [icon]="icon()"
        class="pointer-events-none"
      ></fa-icon>
    </button>
  `
})
export class FaIconButton {

  // Ícone padrão é faTrashCan
  icon: InputSignal<IconDefinition> = input(faTrashCan);

  // Classes extras vindas do pai
  className: InputSignal<string> = input('');

  // Variantes de estilo
  variant = input<'danger' | 'blue' | 'white'>('danger');

  // Evento de clique
  clicked = output<void>();

  // Mapa interno de estilos
  private styles: Record<string, string> = {
    danger: `
        w-8 h-8 flex items-center justify-center
        bg-red-600 text-white rounded-full
        hover:bg-red-700 transition-all duration-200
        cursor-pointer
    `,
    white: `
        w-8 h-8 flex items-center justify-center
        text-gray-200 rounded-full bg-transparent
        hover:bg-red-700 transition-all duration-200
        cursor-pointer
    `,
    blue: `
        w-8 h-7 flex items-center justify-center
        text-blue-700 bg-white text-4xl rounded-full
        hover:text-blue-600 hover:scale-105 transition-all duration-200
        cursor-pointer
    `
  };

  // Computed performático
  buttonClasses = computed(() =>
    `${this.styles[this.variant()]} ${this.className()}`
  );

  handleClick() {
    this.clicked.emit();
  }
}