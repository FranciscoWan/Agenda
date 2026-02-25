import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateTimePicker } from '../../../../shared/date-time-picker/date-time-picker';
import { CreateEventPayload, CRUDEventService } from '../../../../core/services/CRUD-event.service'
import { PopupService } from '../../../../shared/popup-modal/popup-modal.service';



@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [FormsModule, CommonModule, DateTimePicker],
  templateUrl: './modal-new-event.html',
  styleUrl: './modal-new-event.css',
})
export class NewEvent {

  titulo = '';
  descricao = '';
  dataInicio = '';
  dataFim = '';
  cor = '#8FFA60';

  popup = inject(PopupService);

  cores = [
    { nome: 'Laranja', valor: '#FA7F60' },
    { nome: 'Azul', valor: '#60DCFA' },
    { nome: 'Roxo', valor: '#CC60FA' },
    { nome: 'Verde', valor: '#8FFA60' }
  ];

  constructor(
    private eventService: CRUDEventService
  ) { }

  onSubmit() {

    const payload: CreateEventPayload = {
      titulo: this.titulo,
      descricao: this.descricao,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
      cor: this.cor
    };

    this.eventService.createEvent(payload)
      .subscribe({
        next: () => {
          this.popup.showSuccess('Evento criado com sucesso');
          this.resetForm();
        },
        error: (error) => {

        this.popup.showError(error?.error?.message);
        throw error;
        }
      });
      this.resetForm()
  }

  resetForm() {
    this.titulo = '';
    this.descricao = '';
    this.dataInicio = '';
    this.dataFim = '';
    this.cor = '#8FFA60';
  }
}
