import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './shared/components/header/header';
import {AlbumGrid} from './features/album/pages/album-grid/album-grid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, AlbumGrid],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('copa26');
}
