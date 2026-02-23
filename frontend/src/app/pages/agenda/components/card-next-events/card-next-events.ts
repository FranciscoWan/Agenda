import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../core/services/event.service';

@Component({
  selector: 'app-card-next-events',
  imports: [CommonModule],
  templateUrl: './card-next-events.html',
})
export class CardNextEvents {

  constructor(
    private eventService: EventService
  ){}

  title = input.required<string>();
  description = input.required<string>();
  startDate = input.required<string>();
  endDate = input.required<string>();
  color = input.required<string>();

  get formattedDate(): string {
    const start = new Date(this.startDate());
    const end = new Date(this.endDate());

    const date = start.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });

    const endDate = end.toLocaleDateString('pt-BR',{
      day: '2-digit',
      month: 'short',
    });

    const startTime = start.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const endTime = end.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${date} - ${startTime} / ${endDate} - ${endTime}`;
  }
}
