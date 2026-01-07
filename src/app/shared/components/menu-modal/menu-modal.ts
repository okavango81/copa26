import {Component, computed} from '@angular/core';
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

  showMyStickers = false; // Controle de tela
  showDuplicatesModal = false;

  constructor(public service: StickerService) {
  }

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

  // Função para Exportar
  exportAlbum() {
    // 1. Pergunta o nome ao usuário
    const userFileName = window.prompt("Digite o nome para o arquivo:", "meu-album-stickers");

    // 2. Se o usuário cancelar ou deixar vazio, interrompe a função
    if (userFileName === null) return;

    // 3. Garante que o nome tenha a extensão .json
    const finalFileName = userFileName.trim() || "meu-album-stickers";
    const fileNameWithExt = finalFileName.endsWith('.json') ? finalFileName : `${finalFileName}.json`;
    const nameWithoutExt = finalFileName.replace(/\.[^/.]+$/, "");
    const data = this.service.exportJson(nameWithoutExt);
    const blob = new Blob([data], {type: 'application/json'});
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileNameWithExt; // Usa o nome definido pelo usuário
    link.click();

    window.URL.revokeObjectURL(url);
  }

// Função para Importar
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Remove a extensão .json do nome para exibir no sistema
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        // Passamos o nome para o service
        this.service.importJson(content, nameWithoutExt);
        this.closeMenu();
      };
      reader.readAsText(file);
    }
  }



// Agrupa as figurinhas que o usuário TEM por time
  public stickersByTeam = computed(() => {
    const allStickers = this.service.stickers();
    return this.service.teams.map(team => {
      // Filtra as figurinhas do range desse time que o usuário 'has'
      const ownedInRange = allStickers.filter(s =>
        s.number >= team.start &&
        s.number <= team.end &&
        s.has
      );

      return {
        name: team.name,
        count: ownedInRange.length,
        stickers: ownedInRange
      };
    }).filter(team => team.count > 0); // Só mostra times que têm pelo menos uma
  });

  // Agrupa apenas as figurinhas REPETIDAS por time
  public duplicatesByTeam = computed(() => {
    const allStickers = this.service.stickers();

    return this.service.teams.map(team => {
      // Filtra figurinhas do time que possuem duplicatas
      const dupsInRange = allStickers.filter(s =>
        s.number >= team.start &&
        s.number <= team.end &&
        s.duplicates > 0
      );

      // Calcula o total de itens extras (soma de todas as duplicatas do time)
      const totalDupsInTeam = dupsInRange.reduce((acc, s) => acc + s.duplicates, 0);

      return {
        name: team.name,
        count: totalDupsInTeam, // Total de repetidas (volume)
        stickers: dupsInRange   // Lista das figurinhas específicas
      };
    }).filter(team => team.count > 0); // Só mostra times com repetidas
  });

  onOffMyStickers() {
    this.showMyStickers = !this.showMyStickers;
  }

  onOffDuplicates() {
    this.showDuplicatesModal = !this.showDuplicatesModal;
  }

}
