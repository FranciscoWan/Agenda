import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { EventService, CalendarEvent } from '../../../../core/services/event.service';
import { CardNextEvents } from '../card-next-events/card-next-events';

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CardNextEvents],
  templateUrl: './calendar-day.html',
})
export class CalendarDayComponent implements OnInit {

  ngOnInit() {
    const date = this.currentDate();

    this.eventService.loadEventsByDay(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }

  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;

  // Data atual
  currentDate = signal(new Date());

  // Derivados para facilitar
  currentYear = computed(() => this.currentDate().getFullYear());
  currentMonth = computed(() => this.currentDate().getMonth());
  currentDay = computed(() => this.currentDate().getDate());

  // Modal
  selectedEvent = signal<CalendarEvent | null>(null);
  isModalOpen = signal(false);

  constructor(private eventService: EventService) {
  }

  // Eventos do dia, ordenados por hora
  eventsOfDay = computed(() => {
    const date = this.currentDate();
    const events = this.eventService.events();

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return events
      // Ordenação dos eventos por horário no calendário
      .filter(e => {
        const start = new Date(e.dataInicio);
        const end = new Date(e.dataFim);
        return start <= dayEnd && end >= dayStart;
      })
      .sort((a, b) => {
        const startA = new Date(a.dataInicio).getTime();
        const startB = new Date(b.dataInicio).getTime();
        if (startA !== startB) {
          return startA - startB; // primeiro pelo início
        }

        const endA = new Date(a.dataFim).getTime();
        const endB = new Date(b.dataFim).getTime();
        return endA - endB; // depois pelo fim
      });
  });

  // Navegação entre dias
  previousDay() {
    const date = new Date(this.currentDate());
    date.setDate(date.getDate() - 1);
    this.currentDate.set(date);
    this.eventService.loadEventsByDay(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }

  nextDay() {
    const date = new Date(this.currentDate());
    date.setDate(date.getDate() + 1);
    this.currentDate.set(date);
    this.eventService.loadEventsByDay(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }

  // Abrir modal
  openEvent(event: CalendarEvent) {
    this.selectedEvent.set(event);
    this.isModalOpen.set(true);
  }

  // Fechar modal
  closeModal() {
    this.isModalOpen.set(false);
    this.selectedEvent.set(null);
  }
}
