import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { DateTimePicker } from '../../../../shared/date-time-picker/date-time-picker';
import { EventService } from '../../../../core/services/event.service'
import { PopupModalComponent } from '../../../../shared/popup-modal/popup-modal';


@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [FormsModule, CommonModule, DateTimePicker, PopupModalComponent],
  templateUrl: './modal-new-event.html',
  styleUrl: './modal-new-event.css',
})
export class NewEvent {

  titulo = '';
  descricao = '';
  dataInicio = '';
  dataFim = '';
  cor = '#8FFA60';

  showPopup = signal(false);
  popupMessage = '';
  popupType: 'success' | 'error' | 'warning' = 'success';

  cores = [
    { nome: 'Laranja', valor: '#FA7F60' },
    { nome: 'Azul', valor: '#60DCFA' },
    { nome: 'Roxo', valor: '#CC60FA' },
    { nome: 'Verde', valor: '#8FFA60' }
  ];

  constructor(
    private authService: AuthService,
    private eventService: EventService
  ) { }

  onSubmit() {
    const token = this.authService.getToken();

    if (!token) {
      alert('Usuário não autenticado');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      titulo: this.titulo,
      descricao: this.descricao,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
      cor: this.cor
    };

    this.eventService.createEvent(payload)
      .subscribe({
        next: () => {
        this.popupMessage = 'Evento salvo com sucesso';
        this.popupType = 'success';
        this.showPopup.set(true);
          this.resetForm();
        },
        error: (error) => {
        this.popupMessage = error?.error?.message;
        this.popupType = 'error';
        this.showPopup.set(true);
        throw new Error(this.popupMessage);
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
