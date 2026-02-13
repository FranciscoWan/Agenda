import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-default',
  imports: [CommonModule, RouterModule],
  templateUrl: './default.html',
  styleUrl: './default.css',
})
export class Default {
}
