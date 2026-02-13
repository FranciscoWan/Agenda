import { Routes } from '@angular/router';
import { Default } from './pages/default/default'
import { Registro } from './pages/registro/registro'

export const routes: Routes = [
    { path: '', component: Default },
    { path: 'registro', component: Registro }
];
