import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Registro } from '../registro/registro'

@Component({
  selector: 'app-default',
  imports: [CommonModule, RouterModule, Registro],
  templateUrl: './default.html',
  styleUrl: './default.css',
})
export class Default {

}
