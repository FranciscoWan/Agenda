import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { EventService, CalendarEvent } from '../../../../core/services/event.service';
import { CardNextEvents } from '../card-next-events/card-next-events';

@Component({
  selector: 'app-calendar-week',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CardNextEvents],
  templateUrl: './calendar-week.html',
})
export class CalendarWeekComponent implements OnInit {

  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;

  currentDate = signal(new Date());

  selectedEvent = signal<CalendarEvent | null>(null);
  isModalOpen = signal(false);

  weekDays = signal<Date[]>([]);

  constructor(private eventService: EventService) {

    // Sempre que a data mudar → recalcula semana + busca eventos
    effect(() => {
      const date = this.currentDate();

      const { start, end } = this.getWeekRange(date);

      this.generateWeekDays(start);

      this.eventService.loadEventsByWeek(
        start.getFullYear(),
        this.getWeekNumber(start)
      );
    });
  }

  ngOnInit() {}

  // Calcula início (segunda) e fim (domingo)
  getWeekRange(date: Date) {
    const current = new Date(date);
    const day = (current.getDay() + 6) % 7; // transforma domingo=6

    const start = new Date(current);
    start.setDate(current.getDate() - day);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  // Gera array com os 7 dias da semana
  generateWeekDays(start: Date) {
    const days: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }

    this.weekDays.set(days);
  }

  // Calcula número da semana
  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = Math.floor(
      (date.getTime() - firstDayOfYear.getTime()) / 86400000
    );

    return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
  }

  // Organiza eventos por dia da semana
  eventsByDay = computed(() => {
    const events = this.eventService.events();
    const days = this.weekDays();

    const mapped: { [key: string]: CalendarEvent[] } = {};

    for (const day of days) {
      const key = day.toDateString();
      mapped[key] = [];
    }

    for (const e of events) {
      const start = new Date(e.startDate);
      const end = new Date(e.endDate);

      let current = new Date(start);

      while (current <= end) {
        const key = current.toDateString();

        if (mapped[key]) {
          mapped[key].push(e);
        }

        current.setDate(current.getDate() + 1);
      }
    }

    return mapped;
  });

  previousWeek() {
    const date = new Date(this.currentDate());
    date.setDate(date.getDate() - 7);
    this.currentDate.set(date);
  }

  nextWeek() {
    const date = new Date(this.currentDate());
    date.setDate(date.getDate() + 7);
    this.currentDate.set(date);
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
