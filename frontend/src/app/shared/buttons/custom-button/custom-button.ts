import { Component, computed, input, InputSignal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-button',
  imports: [CommonModule],
  templateUrl: './custom-button.html',
})
export class CustomButton {

  text = input('Botão');
  routerLink = input<string | any[] | null>(null);
  click = input<(() => void) | null>(null);

  // Classes extras que podem ser passadas pelo pai
  className: InputSignal<string> = input('');
  
  // Escolhe a estilização
  variant = input<'btn-bg-blue' | 'btn-bg-grey'>('btn-bg-blue');

  // Mapa interno de estilos Tailwind
  private styles: Record<string, string> = {
    'btn-bg-blue': `
      items-center justify-center text-white text-sm/6 font-semibold bg-gradient-to-r from-gray-800
        via-blue-700 bg-[length:200%_200%] bg-[position:0%_0%] hover:bg-[position:100%_100%]
        transition-all duration-700 w-28 h-10 rounded-lg inset-ring inset-ring-white/5
        hover:text-gray-200 cursor-pointer
    `,
    'btn-bg-grey': `
      items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm/6 font-semibold text-white inset-ring inset-ring-white/5 transition-all duration-700 hover:bg-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer 
    `
  };

  // Computed para pegar a classe correta
  buttonClasses = computed(() => this.styles[this.variant()]);

  constructor(private router: Router) { }

  handleClick() {
    if (this.click) {
      this.click();
    } else if (this.routerLink) {
      this.router.navigate(Array.isArray(this.routerLink) ? this.routerLink : [this.routerLink]);
    }
  }
}