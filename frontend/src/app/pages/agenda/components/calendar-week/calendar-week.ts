import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { CRUDEventService } from '../../../../core/services/CRUD-event.service';
import { EventStateService, CalendarEvent } from '../../../../core/services/event-state.service';
import { LoadEventsService } from '../../../../core/services/load-events.service';
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

  protected readonly crudEventService = inject(CRUDEventService)
  protected readonly eventStateService = inject(EventStateService)
  protected readonly loadEventService = inject(LoadEventsService)

  ngOnInit() {
    this.loadWeek(this.currentDate());
  }

  private loadWeek(date: Date) {
    const { start } = this.getWeekRange(date);

    this.generateWeekDays(start);

    this.loadEventService.loadEventsByWeek(
      start.getFullYear(),
      this.getWeekNumber(start)
    ).subscribe({
      error: (err) => {
        throw err
      }
    });
  }
  // Calcula início (domingo) e fim (segunda)
  getWeekRange(date: Date) {
    const current = new Date(date);

    const dayOfWeek = current.getDay(); // 0 (Dom) → 6 (Sáb)

    const start = new Date(current);
    start.setDate(current.getDate() - dayOfWeek);
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

  // Organiza eventos por dia da semana, ordenando pelo horário
  eventsByDay = computed(() => {
    const events = this.eventStateService.events();
    const days = this.weekDays();

    const mapped: { [key: string]: CalendarEvent[] } = {};

    // Inicializa os dias da semana
    for (const day of days) {
      const key = day.toDateString();
      mapped[key] = [];
    }

    // Distribui os eventos nos dias
    for (const e of events) {
      const start = new Date(e.dataInicio);
      const end = new Date(e.dataFim);

      let current = new Date(start);

      while (current <= end) {
        const key = current.toDateString();

        if (mapped[key]) {
          mapped[key].push(e);
        }

        current.setDate(current.getDate() + 1);
      }
    }

    // Ordena os eventos de cada dia
    for (const key in mapped) {
      mapped[key].sort((a, b) => {
        const startA = new Date(a.dataInicio).getTime();
        const startB = new Date(b.dataInicio).getTime();
        if (startA !== startB) return startA - startB;

        const endA = new Date(a.dataFim).getTime();
        const endB = new Date(b.dataFim).getTime();
        return endA - endB;
      });
    }

    return mapped;
  });

  previousWeek() {
    const date = new Date(this.currentDate());
    date.setDate(date.getDate() - 7);
    this.currentDate.set(date);
    this.loadWeek(date);
  }

  nextWeek() {
    const date = new Date(this.currentDate());
    date.setDate(date.getDate() + 7);
    this.currentDate.set(date);
    this.loadWeek(date);
  }

  openEvent(event: CalendarEvent) {
    this.selectedEvent.set(event);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedEvent.set(null);
  }

  handleDeletedEvent() {
    this.closeModal();
  }
}
