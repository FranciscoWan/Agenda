import { computed, Injectable, signal, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { EventSyncService } from './sync.service';

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
  private eventSyncService = inject(EventSyncService);
  
  readonly events = signal<CalendarEvent[]>([]);
  private visibleCount = signal(5);

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

  // Subject para emitir necessidade de reload
  private reloadNeededSubject = new Subject<void>();
  public readonly reloadNeeded$ = this.reloadNeededSubject.asObservable();

  constructor() {
    this.setupSyncListener();
  }

  private setupSyncListener() {
    this.eventSyncService.notifications$.subscribe({
      next: (notification) => {
        console.log('📨 Notificação SSE recebida:', notification.type);
        
        // Emitir que reload é necessário
        this.reloadNeededSubject.next();
      },
      error: (error) => {
        console.error('❌ Erro no SSE:', error);
      }
    });
  }

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