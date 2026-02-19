import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomButton } from "../../shared/buttons/custom-button/custom-button";

@Component({
  selector: 'app-default',
  imports: [CommonModule,
    RouterModule,
    CustomButton],
  templateUrl: './default.html',
  styleUrl: './default.css',
})
export class Default {
}
