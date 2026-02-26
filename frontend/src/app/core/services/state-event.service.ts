import { computed, Injectable, signal, inject, OnDestroy } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { SyncEventService } from './sync-event.service';
import { LoadEventsService } from './load-events.service';
import { CRUDCreateEventPayload, CRUDEventService } from './CRUD-event.service';

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
export class StateEventService implements OnDestroy {

  private readonly eventSyncService = inject(SyncEventService);
  private readonly loadEventsService = inject(LoadEventsService);
  private readonly crudEventService = inject(CRUDEventService);

  public readonly events = signal<CalendarEvent[]>([]);
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

  private onDestroy$ = new Subject<void>();

  constructor() {
    this.setupSyncListener();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private setupSyncListener(): void {
    this.eventSyncService.notifications$
      .pipe(
        takeUntil(this.onDestroy$),

        switchMap((notification) => {
          console.log('📨 Notificação SSE recebida:', notification.type);

          return this.loadEventsService.reloadEvents();
        })
      )
      .subscribe({
        next: (events) => {
          this.resetVisibleCount();
          this.setEvents(events);
          console.log('✅ Eventos recarregados via SSE');
        },
        error: (error) => {
          console.error('❌ Erro no SSE ou reload:', error);
        }
      });
  }

  private setEvents(events: CalendarEvent[]) {
    this.events.set(events);
  }

  private addEvent(event: CalendarEvent) {
    this.events.update(current => [...current, event]);
  }

  private removeEvent(id: string) {
    this.events.update(events => events.filter(event => event.id !== id));
  }

  private resetVisibleCount() {
    this.visibleCount.set(5);
  }

  public loadMore() {
    this.visibleCount.update(count => count + 4);
  }

  /* ====================== CRUD Methods====================== */

  public createEvent(payload: CRUDCreateEventPayload) {
    return this.crudEventService.createEvent(payload).subscribe({
      next: (event) => {
        this.addEvent(event);
      },
      error: (err) => {
        console.error('Erro ao criar evento:', err);
      }
    });
  }

  public deleteEvent(id: string) {
    return this.crudEventService.deleteEvent(id).subscribe({
      next: () => {
        this.removeEvent(id);
      },
      error: (err) => {
        console.error('Erro ao deletar evento:', err);
      }
    });
  }

  /* ===================== LOAD METHODS ===================== */

  public loadEventsByMonth(year: number, month: number) {
    this.loadEventsService.loadEventsByMonth(year, month).subscribe({
      next: (events) => {
        this.resetVisibleCount();
        this.setEvents(events);
      },
      error: (err) => {
        console.error('Erro ao carregar eventos do mês:', err);
      }
    });
  }

  public loadEventsByWeek(year: number, week: number) {
    this.loadEventsService.loadEventsByWeek(year, week).subscribe({
      next: (events) => {
        this.resetVisibleCount();
        this.setEvents(events);
      },
      error: (err) => {
        console.error('Erro ao carregar eventos da semana:', err);
      }
    });
  }

  public loadEventsByDay(year: number, month: number, day: number) {
    this.loadEventsService.loadEventsByDay(year, month, day).subscribe({
      next: (events) => {
        this.resetVisibleCount();
        this.setEvents(events);
      },
      error: (err) => {
        console.error('Erro ao carregar eventos do dia:', err);
      }
    });
  }
}