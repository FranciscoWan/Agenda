import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-button-grey',
  templateUrl: './custom-button-grey.html',
  styleUrls: []
})
export class CustomButtonGrey {
  // Texto do botão
  @Input() text: string = 'Botão';

  // Rota opcional para o botão
  @Input() routerLink?: string | any[];

  // Evento de clique opcional
  @Input() click?: () => void;

  // Classes extras que podem ser passadas pelo pai
  @Input() className: string = '';


  constructor(private router: Router) { }

  handleClick() {
    if (this.click) {
      this.click();
    } else if (this.routerLink) {
      this.router.navigate(Array.isArray(this.routerLink) ? this.routerLink : [this.routerLink]);
    }
  }
}