import { Component, computed, input, Input, InputSignal, Signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-button-blue',
  templateUrl: './custom-button-blue.html',
  styleUrls: []
})
export class CustomButtonBlue {
  // Texto do botão
  text: InputSignal<string> = input('Botão');

  // Rota opcional para o botão
  routerLink?: InputSignal<string|any[]>;

  // Evento de clique opcional
  click?: InputSignal< () => void>;

  // Classes extras que podem ser passadas pelo pai
  className: InputSignal<string> = input('');


  constructor(private router: Router) { }

  handleClick() {
    if (this.click) {
      this.click();
    } else if (this.routerLink) {
      this.router.navigate(Array.isArray(this.routerLink) ? this.routerLink : [this.routerLink]);
    }
  }
}
