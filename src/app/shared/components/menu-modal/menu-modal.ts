import { Component } from '@angular/core';
import {StickerService} from '../../../core/service/sticker-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-menu-modal',
  imports: [
    AsyncPipe
  ],
  templateUrl: './menu-modal.html',
  styleUrl: './menu-modal.scss',
})
export class MenuModal {
  constructor(public service: StickerService) {}

  showResetConfirm = false; // Controla a exibição do diálogo de confirmação


  // Impede que o clique dentro do modal feche o menu (propagação)
  stopProp(event: Event) {
    event.stopPropagation();
  }

  confirmReset() {
    this.service.resetAlbumConfirmed();
    this.showResetConfirm = false;
  }

  cancelReset() {
    this.showResetConfirm = false;
  }

  // Sobrescreve o fechar para resetar o estado interno
  closeMenu() {
    this.showResetConfirm = false;
    this.service.toggleMenu();
  }
}
