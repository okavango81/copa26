import {computed, Injectable, signal} from '@angular/core';
import {StickerModel} from '../../data/models/sticker-model';

@Injectable({
  providedIn: 'root',
})
export class StickerService {

  teams = [
    {name: 'Alemanha', start: 380, end: 399},
    {name: 'Arábia Saudita', start: 200, end: 219},
    {name: 'Argentina', start: 180, end: 199},
    {name: 'Austrália', start: 280, end: 299},
    {name: 'Bélgica', start: 420, end: 439},
    {name: 'Brasil', start: 520, end: 539},
    {name: 'Camarões', start: 560, end: 579},
    {name: 'Canadá', start: 440, end: 459},
    {name: 'Catar', start: 40, end: 59},
    {name: 'Coreia do Sul', start: 640, end: 659},
    {name: 'Costa Rica', start: 360, end: 379},
    {name: 'Croácia', start: 480, end: 499},
    {name: 'Dinamarca', start: 300, end: 319},
    {name: 'Equador', start: 60, end: 79},
    {name: 'Especiais/Estádios', start: 1, end: 39},
    {name: 'Espanha', start: 340, end: 359},
    {name: 'EUA', start: 160, end: 179},
    {name: 'França', start: 260, end: 279},
    {name: 'Gana', start: 600, end: 619},
    {name: 'Holanda', start: 100, end: 119},
    {name: 'Inglaterra', start: 120, end: 139},
    {name: 'Irã', start: 140, end: 159},
    {name: 'Japão', start: 400, end: 419},
    {name: 'Marrocos', start: 460, end: 479},
    {name: 'México', start: 220, end: 239},
    {name: 'Momentos Finais', start: 660, end: 670},
    {name: 'Polônia', start: 240, end: 259},
    {name: 'Portugal', start: 580, end: 599},
    {name: 'Senegal', start: 80, end: 99},
    {name: 'Sérvia', start: 500, end: 519},
    {name: 'Suíça', start: 540, end: 559},
    {name: 'Tunísia', start: 320, end: 339},
    {name: 'Uruguai', start: 620, end: 639}
  ];

  selectedTeamIndex = signal(0);

  // Lógica de pegar o intervalo (getRange)
  getRange(start: number, end: number) {
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push({number: i, has: false, duplicates: 0});
    }
    return range;
  }

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
      // Se por algum motivo o que está no banco for um array vazio, forçamos o reset
      if (parsed.length === 0) {
        this.resetAll();
        return;
      }
      this.stickersSignal.set(
        parsed.map(f => new StickerModel(f.number, f.has, f.duplicates, f.isPressing ?? false))
      );
    } else {
      this.resetAll(); // Usa o método de reset para criar as 670 figs
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

  toggleStickerHas(stickerNumber: number, forceValue?: boolean) {
    this.stickersSignal.update(list => {

      return list.map(s => {
        if (s.number === stickerNumber) {
          const newValue = forceValue !== undefined ? forceValue : !s.has;
          // Criamos uma nova instância da classe para manter a integridade
          return new StickerModel(s.number, newValue, s.duplicates, s.isPressing);

        }
        return s;

      });

    });
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
          return new StickerModel(s.number, true, s.duplicates - 1, s.isPressing);
        }
        return s;
      })
    );
    this.save();
  }

  resetAll() {
    const cleanAlbum = Array.from({length: 670}, (_, i) =>
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
