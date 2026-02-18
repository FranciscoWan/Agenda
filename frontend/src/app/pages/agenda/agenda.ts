import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import { NewEvent } from '../../shared/new-event/new-event';

// import { CalendarDayComponent } from '../calendar/calendar-day.component';
// import { CalendarWeekComponent } from '../calendar/calendar-week.component';
import { CalendarMonthComponent } from './components/calendar-month/calendar-month';

type ViewMode = 'day' | 'week' | 'month';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    CalendarMonthComponent,
    FontAwesomeModule,
    NewEvent,
  ],
  templateUrl: './agenda.html'
})
export class Agenda {

  faCirclePlus = faCirclePlus;

  constructor(
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
    this.showNewEventModal.set(true);
  }

  closeModal() {
    this.showNewEventModal.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}