import {computed, Injectable, signal} from '@angular/core';
import {StickerModel} from '../../data/models/sticker-model';

@Injectable({
  providedIn: 'root',
})
export class StickerService {
  public fileName: string = "Meu Álbum";
  private readonly KEY = 'sticker_album';

  // 1. Criamos o Signal privado que guarda o estado
  private stickersSignal = signal<StickerModel[]>([]);

  // 2. Expomos como readonly para os componentes lerem
  public stickers = this.stickersSignal.asReadonly();

  constructor() {
    this.load();
  }

  private load() {
    const data = localStorage.getItem(this.KEY);

    if (data) {
      const parsed: any[] = JSON.parse(data);

      // 3. Usamos o .set() para atualizar o Signal
      this.stickersSignal.set(
        parsed.map(f => new StickerModel(f.number, f.has, f.duplicates, f.isPressing ?? false))
      );
    } else {
      // Inicialização do álbum (670 figurinhas)
      const initialAlbum = Array.from({length: 670}, (_, i) =>
        new StickerModel(i + 1, false, 0, false)
      );

      this.stickersSignal.set(initialAlbum);
      this.save();
    }
  }

  // Calcula o total de figurinhas marcadas como 'has'
  public totalObtained = computed(() =>
    this.stickersSignal().filter(s => s.has).length
  );

  // Calcula a porcentagem para a barra de progresso (opcional mas legal)
  public percentageCompleted = computed(() => {
    const total = this.stickersSignal().length;
    if (total === 0) return 0;
    return (this.totalObtained() / total) * 100;
  });

  public save() {
    // 4. Para ler o valor de um Signal, usamos os parênteses ()
    localStorage.setItem(this.KEY, JSON.stringify(this.stickersSignal()));
  }

  toggleHas(num: number) {
    // O .update() recebe a lista atual e retorna uma nova lista
    this.stickersSignal.update(list =>
      list.map(s => {
        if (s.number === num) {
          // Retornamos uma nova instância da classe com os dados alterados
          return new StickerModel(s.number, !s.has, 0, false);
        }
        return s;
      })
    );
    this.save();
  }

  incrementDuplicate(num: number) {
    this.stickersSignal.update(list =>
      list.map(s => {
        if (s.number === num && s.has) {
          return new StickerModel(s.number, true, s.duplicates + 1, false);
        }
        return s;
      })
    );
    this.save();
  }

  decrementDuplicate(num: number) {
    this.stickersSignal.update(list =>
      list.map(s => {
        if (s.number === num && s.duplicates > 0) {
          return new StickerModel(s.number, true, s.duplicates - 1, false);
        }
        return s;
      })
    );
    this.save();
  }

  resetAll() {
    const cleanAlbum = Array.from({ length: 670 }, (_, i) =>
      new StickerModel(i + 1, false, 0, false)
    );

    this.stickersSignal.set(cleanAlbum); // Atualiza o Signal
    this.fileName = "Meu Álbum";
    this.save(); // Salva no LocalStorage
  }

  exportJson(): string {
    // Chamamos o signal() para pegar o array atual e então converter
    return JSON.stringify(this.stickersSignal());
  }

  importJson(payload: string) {
    try {
      const parsed = JSON.parse(payload);

      if (!Array.isArray(parsed)) throw new Error('Formato inválido');

      const importedData = parsed.map(f =>
        new StickerModel(f.number, f.has, f.duplicates, f.isPressing ?? false)
      );

      this.stickersSignal.set(importedData); // Notifica o app inteiro da mudança
      this.save();
    } catch (e) {
      console.error('Erro ao importar JSON:', e);
      alert('O arquivo importado é inválido.');
    }
  }

}
