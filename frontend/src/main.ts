import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './app/core/interceptor/auth.interceptor';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { errorInterceptor } from './app/core/interceptor/error.interceptor';


registerLocaleData(localePt);

bootstrapApplication(App, {
  providers: [provideRouter(routes), 
    provideHttpClient(), 
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideHttpClient(withInterceptors([errorInterceptor])
    )
  ]
});

