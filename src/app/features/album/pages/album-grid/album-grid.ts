import {Component, inject} from '@angular/core';
import {StikerCard} from '../../components/stiker-card/stiker-card';
import {SearchInput} from '../../../../shared/components/search-input/search-input';
import {StickerService} from '../../../../core/service/sticker-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-album-grid',
  imports: [
    StikerCard,
    SearchInput,
    AsyncPipe
  ],
  templateUrl: './album-grid.html',
  styleUrl: './album-grid.scss',
})
export class AlbumGrid {

  isMouseDown = false;
  startX: any;
  scrollLeft: any;
  constructor(protected service: StickerService) {
  }

  private stickerService = inject(StickerService);

  teams = this.stickerService.teams;

  get selectedIndex() {
    return this.stickerService.selectedTeamIndex();
  }

  getCards() {
    const team = this.teams[this.selectedIndex];
    // O filtro deve ser feito no array global do service
    return this.stickerService.stickers().filter(s =>
      s.number >= team.start && s.number <= team.end
    );
  }

  startDragging(e: MouseEvent, el: HTMLDivElement) {
    this.isMouseDown = true;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }

  stopDragging() {
    this.isMouseDown = false;
  }

  moveEvent(e: MouseEvent, el: HTMLDivElement) {
    if (!this.isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - this.startX) * 2; // Velocidade do arraste
    el.scrollLeft = this.scrollLeft - walk;
  }

  selectTeam(index: number) {
    this.stickerService.selectedTeamIndex.set(index);

    setTimeout(() => {
      const activeBtn = document.querySelector('.team-button.active');

      if (activeBtn) {
        // 1. Centraliza o botão na barra de seleções
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // Evita que a página inteira pule verticalmente para o botão
          inline: 'center'  // Centraliza o botão horizontalmente no container
        });
      }

      // 2. Garante que a página suba para o topo (opcional, se desejar)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }
}
