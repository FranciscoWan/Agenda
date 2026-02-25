import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PopupService } from './shared/popup-modal/popup-modal.service';
import { PopupModalComponent } from './shared/popup-modal/popup-modal';
import { GlobalLoaderComponent } from './shared/loader/global-loader.component'
import { EventSyncService } from './core/services/sync.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, PopupModalComponent, GlobalLoaderComponent],
  templateUrl: './app.html',
  standalone: true,
})
export class App {
  
  private syncService = inject(EventSyncService);

  constructor(public popup: PopupService) {
    this.syncService.connectToSSE();
  }
}
