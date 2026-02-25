// error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { PopupService } from '../../shared/popup-modal/popup-modal.service';
import { GlobalLoaderService } from '../../shared/loader/loading.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const popup = inject(PopupService);
  const loading = inject(GlobalLoaderService);

  loading.start();

  return next(req).pipe(

    catchError((error) => {

      if (error.status === 0 || error.status >= 500) {
        popup.showError(
          'Erro ao conectar com o servidor. Tente novamente.'
        );
      }

      return throwError(() => error);
    }),

    finalize(() => {
      loading.stop();
    })
  );
};