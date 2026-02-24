import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CustomButton } from "../../shared/buttons/custom-button/custom-button";
import { PopupService } from '../../shared/popup-modal/popup-modal.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CustomButton],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';

  popup = inject(PopupService);

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
        const message = error?.error?.message ?? 'Usuário ou senha inválidos';
        this.popup.showError(message);
      }
    });
  }
}