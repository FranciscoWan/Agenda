import { Component, Output, EventEmitter, output, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'fa-circle-plus-button',
    standalone: true,
    imports: [FontAwesomeModule],
    template: `
    <button
    (click)="onClick()"
    class="w-6 h-6 flex items-center justify-center 
            bg-white rounded-full shadow-md 
            hover:scale-105 transition-all duration-200 m-4">
        <fa-icon
            [icon]="icon()"
            class="text-blue-700 text-4xl pointer-events-none m-4 hover:scale-105 transition-all duration-200">
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
