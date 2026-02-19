import { Component, Output, EventEmitter, output, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'fa-circle-plus-button',
    standalone: true,
    imports: [FontAwesomeModule],
    template: `
    <button class="px-8 py-2 text-3xl cursor-pointer" (click)="onClick()">
        <fa-icon [icon]="icon()" style="color: rgba(79, 70, 229, 1.00);" class="pointer-events-none">
        </fa-icon>
    </button>
  `
})
export class FaCirclePlusButton {
    
    icon = input<IconDefinition>(faCirclePlus);
    clicked = output<void>();

    onClick() {
        this.clicked.emit();
    }
}
