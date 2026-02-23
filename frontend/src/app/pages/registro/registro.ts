import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

import { RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { CustomButton } from "../../shared/buttons/custom-button/custom-button";
import { PopupModalComponent } from '../../shared/popup-modal/popup-modal';



@Component({
  selector: 'app-registro',
  imports: [CommonModule,
    FormsModule,
    RouterModule,
    CustomButton,
    PopupModalComponent],
  standalone: true,
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  username = '';
  password = '';
  telefone = '';
  showPopup = signal(false);
  popupMessage = '';
  popupType: 'success' | 'error' | 'warning' = 'success';

  constructor(private authService: AuthService) { }

  onSubmit() {
    const data = {
      username: this.username,
      password: this.password,
      telefone: this.telefone
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        this.popupType = 'success'
        this.popupMessage = response?.response?.message || 'Usuário criado com sucesso!';
        this.showPopup.set(true);
        this.resetForm()
      },
      error: (error) => {
        this.popupMessage = error?.error?.message;
        this.popupType = 'error';
        this.showPopup.set(true);
        throw new Error(this.popupMessage);
      }

    });
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.telefone = '';
  }
  closePopup() {
    this.showPopup.set(false);
  }
}
