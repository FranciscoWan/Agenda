import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { EventService, CalendarEvent } from '../../../../core/services/event.service';
import { CardNextEvents } from '../card-next-events/card-next-events';

@Component({
  selector: 'app-calendar-month',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CardNextEvents],
  templateUrl: './calendar-month.html',
  styleUrl: './calendar-month.css',
})
export class CalendarMonthComponent implements OnInit {

  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;

  currentDate = new Date();
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  daysInMonth: number[] = [];
  firstDayOfMonth!: number;

  selectedEvent = signal<CalendarEvent | null>(null);
  isModalOpen = signal(false);

  eventsByDay = computed(() => {
    const currentYear = this.currentYear()
    const currentMonth = this.currentMonth()
    const events = this.eventService.events()
    const mapped: { [key: string]: CalendarEvent[] } = {};

    for (const e of events) {

      const start = new Date(e.startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(e.endDate);
      end.setHours(0, 0, 0, 0);

      let current = new Date(start);

      while (current <= end) {

        if (
          current.getMonth() === currentMonth &&
          current.getFullYear() === currentYear
        ) {
          const key = current.getDate();
          if (!mapped[key]) {
            mapped[key] = [];
          }

          mapped[key].push(e);
        }

        current.setDate(current.getDate() + 1);
      }
    }
    return mapped;
  })

  monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  get monthTitle(): string {
    return `${this.monthNames[this.currentMonth()]} ${this.currentYear()}`;
  }

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.initializeCalendar();
    this.eventService.loadEvents();
  }

  initializeCalendar() {
    const totalDays = new Date(
      this.currentYear(),
      this.currentMonth() + 1,
      0
    ).getDate();

    this.daysInMonth = Array.from(
      { length: totalDays },
      (_, i) => i + 1
    );

    this.firstDayOfMonth = new Date(
      this.currentYear(),
      this.currentMonth(),
      1
    ).getDay();
  }


  previousMonth() {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(-1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
  }

  nextMonth() {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(+1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
  }

  formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}`;
  }

  openEvent(event: CalendarEvent) {
    this.selectedEvent.set(event);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedEvent.set(null);
  }
}