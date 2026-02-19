import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('guard foi chamado')
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    console.log("autenticado")
    return true;
  }

  // Se não tiver token, redireciona para a home
  router.navigate(['/']);
  return false;
};