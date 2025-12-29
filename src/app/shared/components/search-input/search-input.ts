import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {StickerService} from '../../../core/service/sticker-service';

@Component({
  selector: 'app-search-input',
  imports: [
    FormsModule
  ],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  numberOnly: boolean = false;
  private stickerService = inject(StickerService);

  textOrNumberOnly() {
    this.numberOnly = !this.numberOnly;
  }

  selectText(event: Event) {
    const input = event.target as HTMLInputElement;
    // faz o highlight de todo o texto
    if (input && input.select) {
      input.select();
    }
  }

  onSearch(event: any) {
    const query = event.target.value;
    if (!query) return;
    this.search(query);
  }

  search(query: string) {
    const queryLowerCase = query.toLowerCase().trim();
    const teams = this.stickerService.teams;
    let foundTeamIndex = -1;
    let foundStickerNumber: number | null = null;

    const figNumber = parseInt(queryLowerCase);

    // 1. Lógica de busca
    if (!isNaN(figNumber)) {
      foundTeamIndex = teams.findIndex(t => figNumber >= t.start && figNumber <= t.end);
      foundStickerNumber = figNumber;
    } else if (!this.numberOnly) {
      foundTeamIndex = teams.findIndex(t => t.name.toLowerCase().includes(queryLowerCase));
    }

    if (foundTeamIndex !== -1) {
      // 2. Muda a seleção no Service (isso faz o AlbumGrid renderizar as novas figs)
      this.stickerService.selectedTeamIndex.set(foundTeamIndex);

      // 3. Sequência de Scroll
      setTimeout(() => {
        // PRIMEIRO: Sempre centraliza o botão do time na barra superior
        this.scrollTo(`team-${foundTeamIndex}`, 'center');

        if (foundStickerNumber) {
          setTimeout(() => {
            this.scrollTo(`fig-${foundStickerNumber}`, 'nearest');

            const el = document.getElementById(`fig-${foundStickerNumber}`);
            if (el) {
              // 1. Adiciona a classe de animação
              el.classList.add('highlight-sticker');

              // 2. Remove a classe após a animação terminar (1.5s)
              // Isso permite que a animação rode de novo na próxima busca
              setTimeout(() => {
                el.classList.remove('highlight-sticker');
              }, 1500);

              el.focus();
            }
          }, 300);
        }
      }, 100);

      this.searchInput.nativeElement.value = "";
    } else {
      alert(`"${query}" não encontrado.`);
    }
  }

  private scrollTo(id: string, inline: 'center' | 'nearest' = 'nearest') {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Centraliza verticalmente na tela
        inline: inline    // Centraliza horizontalmente (importante para o team-button)
      });
    }
  }
}
