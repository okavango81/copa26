import {Component} from '@angular/core';
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
    const blob = new Blob([data], { type: 'application/json' });
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

}
