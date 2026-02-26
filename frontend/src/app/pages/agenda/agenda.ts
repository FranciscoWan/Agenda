import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { NewEvent } from './modal/modal-new-event/modal-new-event';

import { CalendarDayComponent } from './components/calendar-day/calendar-day';
import { CalendarWeekComponent } from './components/calendar-week/calendar-week';
import { CalendarMonthComponent } from './components/calendar-month/calendar-month';

import { FaIconButton } from '../../shared/buttons/fa-icon-button/fa-icon-button';
import { CardNextEvents } from './components/card-next-events/card-next-events';

import { CRUDEventService } from '../../core/services/CRUD-event.service';
import { StateEventService } from '../../core/services/state-event.service';

type ViewMode = 'day' | 'week' | 'month';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    CalendarMonthComponent,
    CalendarWeekComponent,
    CalendarDayComponent,
    FontAwesomeModule,
    FaIconButton,
    NewEvent,
    CardNextEvents
  ],
  templateUrl: './agenda.html',
})

export class Agenda {
  protected readonly eventStateService = inject(StateEventService);
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  protected faCirclePlusIcon: IconDefinition = faCirclePlus;

  protected isNewEventModalOpen = signal(false);

  protected viewMode = signal<ViewMode>('month');

  protected showNewEventModal = signal(false);

  public setView(mode: ViewMode) {
    this.viewMode.set(mode);
  }

  public openModal() {
    this.isNewEventModalOpen.set(true);
  }

  public closeModal() {
    this.isNewEventModalOpen.set(false);
  }

  public logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro ao fazer logout:', err);
      }
    });
  }

  public onScroll(event: Event) {
    const element = event.target as HTMLElement;

    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (atBottom) {
      this.eventStateService.loadMore();
    }
  }
}