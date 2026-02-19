import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import { NewEvent } from './modal/modal-new-event/modal-new-event';

// import { CalendarDayComponent } from '../calendar/calendar-day.component';
import { CalendarWeekComponent } from './components/calendar-week/calendar-week';
import { CalendarMonthComponent } from './components/calendar-month/calendar-month';

import { FaCirclePlusButton } from '../../shared/buttons/fa-circle-plus/fa-circle-plus';
import { CardNextEvents } from './components/card-next-events/card-next-events';

import { EventService } from '../../core/services/event.service';



type ViewMode = 'day' | 'week' | 'month';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    CalendarMonthComponent,
    CalendarWeekComponent,
    FontAwesomeModule,
    FaCirclePlusButton,
    NewEvent,
    CardNextEvents
  ],
  templateUrl: './agenda.html'
})
export class Agenda {
  upcomingEvents = computed(() => {
  const now = new Date();
  return this.eventService.events()
    .filter(event => new Date(event.startDate) > now)
    .sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .slice(0, 5);
});

  faCirclePlus = faCirclePlus;

  isModalOpen = signal(false);
  

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,) {
    this.username$ = this.authService.username$;
  }

  username$: Observable<string | null>;

  viewMode = signal<ViewMode>('month');

  showNewEventModal = signal(false);

  dataChild: number = 0;

  setView(mode: ViewMode) {
    this.viewMode.set(mode);
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}