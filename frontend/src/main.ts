import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { errorInterceptor } from './app/core/interceptor/error.interceptor';

registerLocaleData(localePt);

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([errorInterceptor]) // 👈 mantém só o interceptor de erro
    ),

    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
});