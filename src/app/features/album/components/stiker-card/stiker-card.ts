import {Component, inject, Input} from '@angular/core';
import {StickerService} from '../../../../core/service/sticker-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-stiker-card',
  imports: [
    AsyncPipe
  ],
  templateUrl: './stiker-card.html',
  styleUrl: './stiker-card.scss',
})
export class StikerCard {

  constructor(protected service: StickerService,) {
  }
  @Input() sticker: any;
  private timeout: any;
  isPressing = false;

  private stickerService = inject(StickerService);

  onDoubleClick() {
    const newValue = !this.sticker.has;

    if (!this.sticker.has) {
      this.sticker.has = true; // Atualização visual imediata
      this.stickerService.toggleStickerHas(this.sticker.number, true);

    } else if (this.sticker.has && this.sticker.duplicates > 0) {
      return;

    } else {
      if (confirm(`Deseja desmarcar a nº ${this.sticker.number}?`)) {
        this.sticker.has = false; // Atualização visual imediata
        this.stickerService.toggleStickerHas(this.sticker.number, false);
      }
    }
  }

  // Inicia o contador ao pressionar
  startPress() {
    this.isPressing = true;
    this.endPress(); // Limpa qualquer timer residual
    this.timeout = setTimeout(() => {
      if (this.sticker.has) {
        this.stickerService.incrementDuplicate(this.sticker.number);
        // Opcional: feedback tátil em celulares
        if (navigator.vibrate) navigator.vibrate(50);
      }
    }, 500); // Tempo de espera para o "segurar"
  }

  // Cancela se soltar antes do tempo
  endPress() {
    this.isPressing = false;
    clearTimeout(this.timeout);
  }

  onBadgeClick(event: Event) {
    event.stopPropagation(); // Impede que o clique no badge dispare eventos do card
    this.stickerService.decrementDuplicate(this.sticker.number);
  }
}
