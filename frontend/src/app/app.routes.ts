import { Routes } from '@angular/router';
import { Default } from './pages/default/default'
import { Registro } from './pages/registro/registro'
import { Login } from './pages/login/login';
import { Agenda } from './pages/agenda/agenda'
import { authGuard } from './core/guards/auth-guard';



export const routes: Routes = [
    { path: '', component: Default },
    { path: 'registro', component: Registro },
    { path: 'login', component: Login},
    {
        path: 'agenda',
        component: Agenda,
        canActivate: [authGuard]
    }
];
