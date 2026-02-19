import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomButtonGrey } from '../../shared/buttons/custom-button-grey/custom-button-grey'
import { CustomButtonBlue } from '../../shared/buttons/custom-button-blue/custom-button-blue';

@Component({
  selector: 'app-default',
  imports: [CommonModule, 
    RouterModule,
    CustomButtonGrey,
    CustomButtonBlue  
  ],
  templateUrl: './default.html',
  styleUrl: './default.css',
})
export class Default {
}
