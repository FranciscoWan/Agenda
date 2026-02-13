import { Routes } from '@angular/router';
import { Default } from './pages/default/default'
import { Registro } from './pages/registro/registro'
import { Login } from './pages/login/login';

export const routes: Routes = [
    { path: '', component: Default },
    { path: 'registro', component: Registro },
    { path: 'login', component: Login}
];
