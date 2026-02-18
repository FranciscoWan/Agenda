import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import flatpickr from 'flatpickr';
import { CommonModule } from '@angular/common';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';

@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-time-picker.html',
  styleUrl: './date-time-picker.css'
})
export class DateTimePicker implements AfterViewInit {

  @ViewChild('input', { static: true }) input!: ElementRef;

  @Input() value!: string;
  @Output() valueChange = new EventEmitter<string>();

  ngAfterViewInit(): void {

    flatpickr(this.input.nativeElement, {
      enableTime: true,
      time_24hr: true,
      enableSeconds: false,
      minuteIncrement: 1,
      allowInput: true,
      disableMobile: true,
      clickOpens: true,
      dateFormat: "d/m/Y H:i",
      locale: Portuguese,

      onReady: (_, __, instance) => {
        // Garante que o scroll funcione corretamente
        instance.calendarContainer.addEventListener('wheel', (e) => {
          e.stopPropagation();
        });
      },

      onChange: (selectedDates) => {
        if (selectedDates.length) {
          this.valueChange.emit(selectedDates[0].toISOString());
        }
      }
    });

  }
}
