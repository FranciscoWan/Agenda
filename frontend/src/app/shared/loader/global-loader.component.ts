// global-loader.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalLoaderService } from './loading.service'

@Component({
  selector: 'global-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if(loading.loading()) {
      <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-transparent p-6 rounded-xl flex flex-col items-center gap-3">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <span class="text-lg text-gray-200">Carregando...</span>
        </div>
      </div>
    }
  `
})
export class GlobalLoaderComponent {
  loading = inject(GlobalLoaderService);
}