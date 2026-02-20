import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CustomButton } from "../../shared/buttons/custom-button/custom-button";
import { PopupModalComponent } from '../../shared/popup-modal/popup-modal';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CustomButton, PopupModalComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  showPopup = signal(false);
  popupMessage = '';
  popupType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    const data = {
      username: this.username,
      password: this.password
    };

    this.authService.login(data).subscribe({
      next: () => {
        // Redireciona para agenda
        this.router.navigate(['/agenda']);
      },
      error: (error) => {
        this.popupMessage = error?.error?.message || 'Usuário ou senha inválidos';
        this.popupType = 'error';
        this.showPopup.set(true);
        throw new Error(this.popupMessage);
      }
    });
  }
}