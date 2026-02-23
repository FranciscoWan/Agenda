import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  color: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})

export class EventService {

  private apiUrl = 'http://localhost:3000/events';

  private visibleCount = signal(4);

  events = signal<CalendarEvent[]>([]);

  constructor(private http: HttpClient) { }

  getEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(this.apiUrl);
  }

  upcomingEvents = computed(() => {
    const now = new Date();

    const sorted = this.events()
      .filter(event => new Date(event.startDate) > now)
      .sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );

    return sorted.slice(0, this.visibleCount());
  });

  loadMore() {
    this.visibleCount.update(count => count + 4);
  }
 
  loadEventsByMonth(year: number, month: number) {
    this.http
      .get<any[]>(
        `${this.apiUrl}?view=month&year=${year}&month=${month}`
      )
      .subscribe(data => {
        const mapped: CalendarEvent[] = data.map(e => ({
          id: e.id,
          title: e.titulo,
          description: e.descricao,
          color: e.cor,
          startDate: e.dataInicio,
          endDate: e.dataFim
        }));

        this.events.set(mapped);
      });
  }

  loadEventsByWeek(year: number, week: number) {
    this.http
      .get<any[]>(
        `${this.apiUrl}?view=week&year=${year}&week=${week}`
      )
      .subscribe(data => {
        const mapped: CalendarEvent[] = data.map(e => ({
          id: e.id,
          title: e.titulo,
          description: e.descricao,
          color: e.cor,
          startDate: e.dataInicio,
          endDate: e.dataFim
        }));

        this.events.set(mapped);
      });
  }

  loadEventsByDay(year: number, month: number, day: number) {
    const url = `${this.apiUrl}?view=day&year=${year}&month=${month}&day=${day}`;
    this.http.get<any[]>(url)
      .subscribe(data => {
        const mapped: CalendarEvent[] = data.map(e => ({
          id: e.id,
          title: e.titulo,      
          description: e.descricao, 
          color: e.cor,          
          startDate: e.dataInicio,
          endDate: e.dataFim
        }));
        this.events.set(mapped);
      });
  }


  createEvent(payload: any) {
    return this.http.post<CalendarEvent>(this.apiUrl, payload).pipe(tap((e) => {
      const mapped: CalendarEvent = {
        id: e.id,
        title: (e as any).titulo,
        description: (e as any).description,
        color: (e as any).cor,
        startDate: (e as any).dataInicio,
        endDate: (e as any).dataFim
      };
      this.events.update(current => [...current, mapped]);
    }));

  }
}
