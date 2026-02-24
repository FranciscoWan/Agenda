import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, Observable, of, switchMap, tap } from 'rxjs';

export interface CalendarEvent {
  id: string;
  usuario_id: string;
  titulo: string;
  descricao: string;
  cor: string;
  dataInicio: string;
  dataFim: string;
}

export interface CreateEventPayload {
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  cor: string;
}

@Injectable({
  providedIn: 'root'
})

export class EventService {

  private apiUrl = 'http://localhost:3000/events';

  readonly events = signal<CalendarEvent[]>([]);

  private visibleCount = signal(4);
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

  constructor(private http: HttpClient) { }

  getEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(this.apiUrl);
  }

  loadEventsByMonth(year: number, month: number) {
    return this.http
      .get<CalendarEvent[]>(
        `${this.apiUrl}?view=month&year=${year}&month=${month}`
      ).pipe(
        filter((eventos: CalendarEvent[]) => eventos.length > 0),
        switchMap((eventos: CalendarEvent[]) => {
          this.events.set(eventos);
          return of(undefined);
        }),
        catchError((err) => {
          throw err;
        }),
      )
  }

  loadEventsByWeek(year: number, week: number) {
    this.http
      .get<CalendarEvent[]>(
        `${this.apiUrl}?view=week&year=${year}&week=${week}`
      ).pipe(
        filter((eventos: CalendarEvent[]) => eventos.length > 0),
        switchMap((eventos: CalendarEvent[]) => {
          this.events.set(eventos);
          return of(undefined);
        }),
        catchError((err) => {
          throw err;
        }),
      )
  }

  loadEventsByDay(year: number, month: number, day: number) {
    const url = `${this.apiUrl}?view=day&year=${year}&month=${month}&day=${day}`;
    this.http.get<CalendarEvent[]>(url)
      .pipe(
        filter((eventos: CalendarEvent[]) => eventos.length > 0),
        switchMap((eventos: CalendarEvent[]) => {
          this.events.set(eventos);
          return of(undefined);
        }),
        catchError((err) => {
          throw err;
        }),
      )
  }

  loadMore() {
    this.visibleCount.update(count => count + 4);
  }

  createEvent(payload: CreateEventPayload) {
    return this.http
      .post<CalendarEvent>(this.apiUrl, payload)
      .pipe(
        tap((event: CalendarEvent) => {
          this.events.update(current => [...current, event]);
        })
      );
  }

  deleteEvent(id: string) {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.events.update(events =>
            events.filter(event => event.id !== id)
          );
        })
      );
  }
}
