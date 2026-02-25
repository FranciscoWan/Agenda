import { computed, Injectable, signal } from '@angular/core';

export interface CalendarEvent {
  id: string;
  usuario_id: string;
  titulo: string;
  descricao: string;
  cor: string;
  dataInicio: string;
  dataFim: string;
}

@Injectable({
  providedIn: 'root'
})

export class EventStateService {
  // Estado centralizado
  readonly events = signal<CalendarEvent[]>([]);
  private visibleCount = signal(5);

  // Computed
  public readonly upcomingEvents = computed(() => {
    const count = this.visibleCount();
    const now = new Date();

    const sorted = this.events()
      .filter(event => new Date(event.dataInicio) > now)
      .sort((a, b) =>
        new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
      );

    return sorted.slice(0, count);
  });

  // Métodos públicos para manipular estado
  setEvents(events: CalendarEvent[]) {
    this.events.set(events);
  }

  addEvent(event: CalendarEvent) {
    this.events.update(current => [...current, event]);
  }

  removeEvent(id: string) {
    this.events.update(events => events.filter(event => event.id !== id));
  }

  resetVisibleCount() {
    this.visibleCount.set(5);
  }

  loadMore() {
    this.visibleCount.update(count => count + 4);
  }
}