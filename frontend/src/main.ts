import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './app/core/interceptor/auth.interceptor';
import { App } from './app/app';
import { routes } from './app/app.routes';


bootstrapApplication(App, {
  providers: [provideRouter(routes), 
    provideHttpClient(), 
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withInterceptors([AuthInterceptor]))
  ]
});

